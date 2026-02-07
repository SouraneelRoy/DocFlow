const express = require('express');
const http = require('http');
const fileUpload = require('express-fileupload');
const { Server } = require("socket.io");

// YOUR LOCAL MODULES
const workflow = require('./workflow');
const injector = require('./injector');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(fileUpload());
app.use(express.static('public')); // For student upload page

// MEMORY DB (Resets on restart)
global.db = {}; 

// ==========================================
// 1. UPLOAD ROUTE (Student Submits File)
// ==========================================
app.post('/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.document) return res.status(400).send('No file.');

        const file = req.files.document;
        const content = file.data.toString('utf8');
        const docId = `doc_${Date.now()}`;
        const upperContent = content.toUpperCase();

        // 🚨 STRICT FORMAT VALIDATION (The Bouncer)
        const hasName    = upperContent.includes("STUDENT NAME:");
        const hasDOB     = upperContent.includes("DATE OF BIRTH:");
        const hasSubject = upperContent.includes("SUBJECT:");
        // Regex ensures "DATE:" is found but ignores "DATE OF BIRTH:"
        const hasDate    = /DATE:(?!\s*OF\s*BIRTH)/i.test(content); 

        if (!hasName || !hasDOB || !hasDate || !hasSubject) {
            console.log(`[SERVER] ❌ REJECTED: ${file.name} (Missing Required Headers)`);
            return res.status(400).json({ 
                success: false, 
                status: 'REJECTED',
                message: "Format Error: File must contain 'STUDENT NAME:', 'DATE OF BIRTH:', 'DATE:', and 'SUBJECT:'" 
            });
        }

        // ✅ FORMAT PASSED: PROCEED TO AI
        const targetDept = workflow.determineDepartment(content); 
        console.log(`[SERVER] Received: ${file.name} -> Routing to: ${targetDept}`);

        // SAVE TO DB
        global.db[docId] = {
            docId: docId,
            fileName: file.name,
            content: content,
            department: targetDept,
            status: 'REVIEW_PENDING',
            history: [`Uploaded at ${new Date().toLocaleTimeString()}`]
        };

        // PUSH TO REDIS
        await injector.pushToQueue(`${targetDept}:review`, global.db[docId]);

        // SIGNAL THE EXE (Reviewer Column)
        io.to(`room_${targetDept}`).emit('NEW_JOB', {
            type: 'REVIEW', 
            docId: docId,
            fileName: file.name,
            content: content,
            message: `New document pending review.`
        });

        // 🔔 TERMINAL LOG
        console.log(`[SERVER] 🔔 Notification sent to ${targetDept.toUpperCase()} Reviewer!`);

        res.json({ success: true, docId: docId, department: targetDept, status: 'ACCEPTED' });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// ==========================================
// 2. SOCKET HANDLING (Connection with EXEs)
// ==========================================
io.on('connection', (socket) => {
    
    // STEP A: The EXE identifies itself
    socket.on('IDENTIFY_DEPT', (deptName) => {
        const roomName = `room_${deptName}`;
        socket.join(roomName);
        console.log(`[SOCKET] Department Connected: ${deptName}`);
    });

    // STEP B: Process Reviewer/Admin Decisions
    socket.on('PROCESS_DECISION', async (data) => {
        const { docId, department, role, action } = data;
        const doc = global.db[docId];

        if (!doc) return;

        console.log(`[DECISION] ${department} (${role}) -> ${action}`);

        // --- SCENARIO 1: REVIEWER DECIDES ---
        if (role === 'REVIEWER') {
            if (action === 'REJECT') {
                doc.status = 'REVIEW_REJECTED';
                doc.history.push('Rejected by Reviewer');
                io.emit('STATUS_UPDATE', { docId, status: 'REVIEW_REJECTED' });
            } 
            else if (action === 'APPROVE') {
                doc.status = 'APPROVAL_PENDING'; 
                doc.history.push('Accepted by Reviewer');
                io.emit('STATUS_UPDATE', { docId, status: 'REVIEW_ACCEPTED' });

                // HANDOFF TO ADMIN
                await injector.pushToQueue(`${department}:admin`, doc);

                io.to(`room_${department}`).emit('NEW_JOB', {
                    type: 'ADMIN',
                    docId: docId,
                    fileName: doc.fileName,
                    content: doc.content,
                    message: "Review passed. Ready for Admin."
                });
                
                // 🔔 TERMINAL LOG
                console.log(`[SERVER] 🔔 Notification sent to ${department.toUpperCase()} Admin!`);
            }
        }

        // --- SCENARIO 2: ADMIN DECIDES ---
        else if (role === 'ADMIN') {
            if (action === 'REJECT') {
                doc.status = 'APPROVAL_REJECTED';
                doc.history.push('Rejected by Admin');
                io.emit('STATUS_UPDATE', { docId, status: 'APPROVAL_REJECTED' });
            } 
            else if (action === 'APPROVE') {
                doc.status = 'APPROVAL_ACCEPTED';
                doc.history.push('Approved by Admin');
                io.emit('STATUS_UPDATE', { docId, status: 'APPROVAL_ACCEPTED' });
            }
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`>> MASTER SERVER running on Port ${PORT}`);
});