const { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler } = require('./handler')

const routes = [
    // [routes 1] - Create
    {
        method: 'POST',
        path: '/notes',
        handler: addNoteHandler
    },
    // [routes 2.0] - Read All
    {
        method: 'GET',
        path: '/notes',
        handler: getAllNotesHandler
    },
    // [routes 2.1] - Read Specific by ID Note
    {
        method: 'GET',
        path: '/notes/{id}',
        handler: getNoteByIdHandler
    },
    // [routes 3] - Update/Edit Note
    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: editNoteByIdHandler
    },
    // [routes 4] - Delete Note
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: deleteNoteByIdHandler
    }
]

module.exports = routes
