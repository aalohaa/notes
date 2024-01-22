const express = require('express')
const router = express.Router()
const fdb = require('../firebase').fdb
const uuid = require('uuid-v4')
const storage = require('../firebase').storage
const fs = require('fs')

const metadata = {
    metadata: {
        firebaseStorageDownloadTokens: uuid()
    },
    contentType: 'image/png',
    cacheControl: 'public, max-age=31536000',
};


router.post('/update', async (req, res) => {
    var r = { r: 0 }
    let note_id = req.body.note_id;
    let user_id = req.session.user_id;
    let new_title = req.body.new_title;
    let new_description = req.body.new_description;
    let new_deadline = req.body.new_deadline;

    if (!new_title || !new_description || !new_deadline) {
        return res.send(r)
    }

    await fdb.collection('users').doc(user_id).collection('notes').doc(note_id).update({
        title: new_title,
        description: new_description,
        deadline: new_deadline
    }).then(() => {
        r['r'] = 1
        res.send(r)
    }).catch((e) => {
        console.log(e)
        res.send(r)
    })

})

router.post('/delete', async (req, res) => {
    var r = { r: 0 }
    let note_id = req.body.note_id;
    let user_id = req.session.user_id;

    if (!note_id || !user_id) {
        return res.send(r);
    }

    await fdb.collection('users').doc(user_id).collection('notes').doc(note_id).delete().then(() => {
        r['r'] = 1
        res.send(r)
    }).catch((e) => {
        console.log(e)
        res.send(r)
    })
})

router.post('/add', async (req, res) => {
    var r = { r: 0 }
    let title = req.body.title;
    let description = req.body.description;
    let deadline = req.body.deadline
    let note_img = req.file;
    console.log(note_img);
    if (!title || !description || !deadline) {
        res.send(r)
        return;
    }

    await fdb.collection('users').doc(req.session.user_id).collection('notes').add({
        title: title,
        description: description,
        deadline: deadline
    }).then(async (nd) => {

        await storage.upload(note_img.path, {
            gzip: true,
            metadata: metadata,
            destination: `notes/${note_img.originalname}`
        });
        var note_image_url = `https://firebasestorage.googleapis.com/v0/b/notes-6b8ea.appspot.com/o/notes%2F${note_img.originalname}?alt=media`
        await fdb.collection('users').doc(req.session.user_id).collection('notes').doc(nd.id).update({ note_img: note_image_url }).then(() => {
            r['r'] = 1;
            res.send(r);

            fs.unlink(note_img.path, ()=>{
                
            })
            
        })

    }).catch((e) => {
        console.log(e);
        res.send(r);
    })
})

router.get('/get', async (req, res) => {
    var data = [];

    await fdb.collection('users').doc(req.session.user_id).collection('notes').orderBy('deadline', 'asc').get().then((notes) => {
        notes.forEach((note) => {
            var note_data = {
                note_id: note.id,
                title: note.data().title,
                description: note.data().description,
                deadline: note.data().deadline,
                note_img: note.data().note_img

            }
            data.push(note_data)
        })
    })

    res.send(data)
})


module.exports = router