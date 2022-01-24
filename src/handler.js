const { nanoid } = require('nanoid')
const notes = require('./notes')

// [HANDLER 1] = CREATE/ADD
const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload

    // nanoid = Unique and random ID generator
    const id = nanoid(16)

    // untuk properti createdAt dan updatedAt itu sama di dalam logika CREATE/menambahkan catatan baru
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    }

    // masukkan nilai-nilai properti dari objek catatan ke dalam array notes menggunakan method push()
    notes.push(newNote)

    // memastikan jika newNotes benar2 sudah di push ke dalam array notes di dalam berkas notes.js
    const isSuccess = notes.filter((note) => note.id === id).length > 0

    // kemudian, isSuccess digunakan untuk menentukan respons yang akan diberikan oleh server [custom response]
    // jika isSuccess bernilai true -> maka beri response berhasil
    // jika isSuccess bernilai false -> maka beri response gagal
    if (isSuccess) {
    // succeeded
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id
            }
        })
        response.code(201) // Created
        return response
    }
    // failed
    const response = h.response({
        status: 'failed',
        message: 'Catatan gagal untuk ditambakan'
    })
    response.code(500) // 500 Internal Server Error
    return response
}

// [HANDLER 2.0] = READ/MENAMPILKAN ALL ITEM
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes
    }
})

// [HANDLER 2.1] = READ/MENAMPILKAN SPECIFIC ITEM
const getNoteByIdHandler = (request, h) => {
    // mengembalikan objek catatan secara spesifik berdasarkan id yang digunakan oleh path parameter
    const { id } = request.params // [ (/notes/{id}) <=== {id} itu adalah path param]

    // ambil objek notes dan masukkan ke init array note
    const note = notes.filter((n) => n.id === id)[0]

    // cek undefined objek, jika ada maka response fail. dan returnkan fungsi handler get note by id ddengan data dan objek note didalamnya
    if (note !== undefined) {
        // success response
        return {
            status: 'success',
            data: {
                // hanya data yang berada pada ID spesifik makanya itu syntaxnya singular
                note
            }
        }
    }
    // fail response
    const response = h.response({
        status: 'failed',
        message: 'Catatan tidak bisa ditampilkan/ditemukan'
    })
    response.code(404) // Not Found
    return response
}

// [Handler 3] = Update/Edit Note by ID
const editNoteByIdHandler = (request, h) => {
    // dapatkan nilai id note yang akan diedit dari path parameters
    const { id } = request.params

    // dapatkan nilai data notes terbaru yang dikirim oleh client melalui body request dari nilai id note yang telah didapatkan
    const { title, tags, body } = request.payload

    // update nilai updatedAt dengan data realtime setelah selesai di-edit
    const updatedAt = new Date().toISOString()

    // [array method - callback] The findIndex() method returns the index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1, indicating that no element passed the test.
    const index = notes.findIndex((note) => note.id === id) // jika sama maka kembalikan nilainya

    // Bila note dengan id yang dicari ditemukan, maka index akan bernilai array index dari objek catatan yang dicari. Jika tidak ditemukan, maka fungsi akan mengembalikan nilai -1
    if (index !== -1) {
        // succedeed response, and update the note
        notes[index] = {
            ...notes[index], // id and createdAt
            title,
            tags,
            body,
            updatedAt
        }
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil di-update'
        })
        response.code(200) // OK
        return response
    }
    // failed response
    const response = h.response({
        status: 'failed',
        message: 'Catatan gagal di-update. Id tidak ditemukan'
    })
    response.code(404) // Not Found
    return response
}

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params

    const index = notes.findIndex((note) => note.id === id)

    if (index !== -1) {
        // success
        // untuk menghapus data pada array, gunakan method splice()
        notes.splice(index, 1)
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus'
        })
        response.code(200)
        return response
    }
    // failed
    const response = h.response({
        status: 'failed',
        message: 'Catatan tidak berhasil dihapus'
    })
    response.code(404) // not found
    return response
}

// export dengan metode object literals agar memudahkan ekspor lebih dari satu nilai pada satu berkas JS.
module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler }
