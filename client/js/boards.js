let editingCard = null;
let currentTask = null;
let taskModalMode = 'create'; // 'create', 'view', 'edit'

// saved reference for the delete handler to prevent duplicates
let boundDeleteEditHandler = null;

function enterEditMode(card) {
    const saveBtn = document.getElementById('save-board');
    const closeBtn = document.getElementById('close-board');
    const createBtn = document.getElementById('create-board');
    const createTaskBtn = document.getElementById('create-task');
    const deleteBtn = document.getElementById('delete-board');

    if (!card) return;

    const id = card.dataset.id;
    const name = card.querySelector('.board-name')?.textContent?.trim() || '';
    if (!name) return;

    editingCard = card;

    const wrapper = document.createElement('div');
    wrapper.classList.add('board-name-wrapper');

    const h2 = document.createElement('h2');
    h2.className = 'board-name';
    h2.textContent = name;

    wrapper.appendChild(h2);
    card.innerHTML = '';
    card.appendChild(wrapper);

    // Hide the list of all boards, show only the current board
    const container = document.querySelector('.boards-list');
    container.innerHTML = '';
    container.appendChild(card);

    saveBtn.disabled = false;
    closeBtn.disabled = false;
    createBtn.style.display = 'none';
    createTaskBtn.style.display = 'block';
    saveBtn.style.display = 'block';
    closeBtn.style.display = 'block';
    deleteBtn.style.display = 'block';

    // Save ID of opened board
    sessionStorage.setItem('openedBoardId', id);

    // Create Kanban-board
    createKanbanBoard(card, id);

    // Loading tasks for this board
    loadTasksForBoard(id);

    // Processing a click on a board name
    function setupBoardNameEditor(h2Element) {
        h2Element.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'board-edit-input';
            input.value = h2Element.textContent;
            input.dataset.editing = 'true'; // Flag for tracking edit mode

            h2Element.replaceWith(input);
            input.focus();

            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const currentSaveBtn = document.getElementById('save-board');
                    if (currentSaveBtn) currentSaveBtn.click();
                }
                if (e.key === 'Escape') {
                    // Cancel editing
                    input.dataset.editing = 'false';
                    const cancelH2 = document.createElement('h2');
                    cancelH2.className = 'board-name';
                    cancelH2.textContent = h2Element.textContent; // Return the original value
                    input.replaceWith(cancelH2);
                    setupBoardNameEditor(cancelH2);
                }
            });
        });
    }

    setupBoardNameEditor(h2);
}

// Creating Kanban-board
function createKanbanBoard(card, boardId) {
    const kanbanBoard = document.createElement('div');
    kanbanBoard.className = 'kanban-board';
    kanbanBoard.id = `kanban-board-${boardId}`;

    const columns = [
        { id: 'todo', title: 'To Do', status: 'To Do' },
        { id: 'inprogress', title: 'In Progress', status: 'In Progress' },
        { id: 'done', title: 'Done', status: 'Done' }
    ];

    columns.forEach(column => {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'kanban-column';
        columnDiv.dataset.status = column.status;

        columnDiv.innerHTML = `
            <div class="kanban-column-header ${column.id}">
                ${column.title}
            </div>
            <div class="kanban-column-content" id="column-${column.id}-${boardId}">
                <!-- Tasks will be loaded here -->
            </div>
        `;

        // Add drag-and-drop
        setupColumnDropZone(columnDiv, column.status, boardId);

        kanbanBoard.appendChild(columnDiv);
    });

    card.appendChild(kanbanBoard);
}

// Setting the drop zone for the column
function setupColumnDropZone(column, status, boardId) {
    const content = column.querySelector('.kanban-column-content');

    content.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.classList.add('drag-over');
    });

    content.addEventListener('dragleave', (e) => {
        if (!column.contains(e.relatedTarget)) {
            column.classList.remove('drag-over');
        }
    });

    content.addEventListener('drop', async (e) => {
        e.preventDefault();
        column.classList.remove('drag-over');

        const taskId = e.dataTransfer.getData('text/plain');
        const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);

        if (taskCard && taskCard.closest('.kanban-column-content') !== content) {
            // Updating the task status on the server
            await updateTaskStatus(taskId, status);

            // Move card to new column
            content.appendChild(taskCard);
            taskCard.classList.remove('dragging');
        }
    });
}

// Update task status
async function updateTaskStatus(taskId, newStatus) {
    try {
        // get the current task data
        const getRes = await fetch(`/api/boards/tasks/task/${taskId}`);
        if (!getRes.ok) throw new Error('Failed to get task data');

        const taskData = await getRes.json();

        // Update only status, saving other data
        const updateData = {
            title: taskData.title,
            description: taskData.description || '',
            estimates: taskData.estimates || 0,
            priority: taskData.priority || 'medium',
            status: newStatus
        };

        const res = await fetch(`/api/boards/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        if (!res.ok) throw new Error('Failed to update task status');

        console.log(`Task ${taskId} status updated to: ${newStatus}`);
    } catch (error) {
        console.error('Error updating task status:', error);
        alert('Failed to update task status');
    }
}

// Loading tasks for board
async function loadTasksForBoard(boardId) {
    try {
        console.log(`Loading tasks for board with id: ${boardId}`);

        const res = await fetch(`/api/boards/tasks/${boardId}`);
        if (!res.ok) throw new Error('Failed to load tasks');

        const tasks = await res.json();
        console.log(`Tasks for board ${boardId}:`, tasks);

        // Clear all columns
        const columns = ['todo', 'inprogress', 'done'];
        columns.forEach(columnId => {
            const column = document.getElementById(`column-${columnId}-${boardId}`);
            if (column) column.innerHTML = '';
        });

        // Place tasks into columns
        tasks.forEach(task => {
            const taskCard = createTaskCard(task, boardId);
            const columnId = getColumnIdByStatus(task.status);
            const column = document.getElementById(`column-${columnId}-${boardId}`);
            if (column) {
                column.appendChild(taskCard);
            }
        });

    } catch (error) {
        console.error('Error loading tasks:', error);
        // Show error in every column
        const columns = ['todo', 'inprogress', 'done'];
        columns.forEach(columnId => {
            const column = document.getElementById(`column-${columnId}-${boardId}`);
            if (column) {
                column.innerHTML = '<p>Error loading tasks...</p>';
            }
        });
    }
}

// Getting column ID by status
function getColumnIdByStatus(status) {
    switch (status) {
        case 'To Do': return 'todo';
        case 'In Progress': return 'inprogress';
        case 'Done': return 'done';
        default: return 'todo';
    }
}

// Creating task card
function createTaskCard(task, boardId) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card priority-${task.priority}`;
    taskCard.dataset.taskId = task._id;
    taskCard.draggable = true;

    // date formating
    const createdDate = task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'No date';

    taskCard.innerHTML = `
        <div class="task-header">
            <h4 class="task-title">${task.title}</h4>
            <div class="task-priority-indicator ${task.priority}"></div>
        </div>
        <div class="task-meta">
            <div class="task-estimates">
                <i class="fas fa-clock"></i>
                ${task.estimates || 0}h
            </div>
            <div class="task-date">${createdDate}</div>
        </div>
        <div class="task-controls">
            <button class="task-delete-btn" title="Delete task">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add handlers
    setupTaskCardHandlers(taskCard, task, boardId);

    return taskCard;
}

// Setting up handlers for a task card
function setupTaskCardHandlers(taskCard, task, boardId) {
    // Double click to view
    taskCard.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openTaskModal('view', task);
    });

    // Drag and drop
    taskCard.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task._id);
        taskCard.classList.add('dragging');
    });

    taskCard.addEventListener('dragend', () => {
        taskCard.classList.remove('dragging');
    });

    // Delete button
    const deleteBtn = taskCard.querySelector('.task-delete-btn');
    deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this task?')) {
            await deleteTask(task._id, boardId);
        }
    });
}

// Deleting task
async function deleteTask(taskId, boardId) {
    try {
        const res = await fetch(`/api/boards/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Failed to delete task');

        // Delete card from DOM
        const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskCard) {
            taskCard.remove();
        }

        console.log(`Task ${taskId} deleted`);
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
    }
}

// Opening a modal window for tasks in different modes
function openTaskModal(mode, taskData = null) {
    const taskModal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('task-modal-title');
    const modalButtons = document.getElementById('task-modal-buttons');

    const titleInput = document.getElementById('task-title');
    const descInput = document.getElementById('task-description');
    const estimatesInput = document.getElementById('task-estimates');
    const prioritySelect = document.getElementById('task-priority');
    const statusSelect = document.getElementById('task-status');

    taskModalMode = mode;
    currentTask = taskData;

    // Customize the title and buttons depending on the mode
    switch (mode) {
        case 'create':
            modalTitle.textContent = 'Create New Task';
            setupCreateTaskButtons(modalButtons);
            clearTaskForm();
            setTaskFormReadonly(false);
            break;

        case 'view':
            modalTitle.textContent = 'View Task';
            setupViewTaskButtons(modalButtons);
            fillTaskForm(taskData);
            setTaskFormReadonly(true);
            break;

        case 'edit':
            modalTitle.textContent = 'Edit Task';
            setupEditTaskButtons(modalButtons);
            fillTaskForm(taskData);
            setTaskFormReadonly(false);
            break;
    }

    taskModal.classList.remove('hide');
    if (!titleInput.readOnly) {
        titleInput.focus();
    }
}

// Setting up buttons to create a task
function setupCreateTaskButtons(container) {
    container.innerHTML = `
        <button id="save-task-btn">
            <i class="fas fa-check"></i>
            Save
        </button>
        <button id="cancel-task-btn">
            <i class="fas fa-times"></i>
            Cancel
        </button>
    `;

    setupTaskButtonHandlers();
}

// Setting up buttons to view a task
function setupViewTaskButtons(container) {
    container.innerHTML = `
        <button id="edit-task-btn">
            <i class="fas fa-edit"></i>
            Edit
        </button>
        <button id="delete-task-btn" class="danger">
            <i class="fas fa-trash"></i>
            Delete
        </button>
        <button id="cancel-task-btn">
            <i class="fas fa-times"></i>
            Close
        </button>
    `;

    setupTaskButtonHandlers();
}

// Setting up buttons for editing a task
function setupEditTaskButtons(container) {
    container.innerHTML = `
        <button id="save-task-btn">
            <i class="fas fa-check"></i>
            Save Changes
        </button>
        <button id="delete-task-btn" class="danger">
            <i class="fas fa-trash"></i>
            Delete
        </button>
        <button id="cancel-task-btn">
            <i class="fas fa-times"></i>
            Cancel
        </button>
    `;

    setupTaskButtonHandlers();
}

// Setting up task button handlers
function setupTaskButtonHandlers() {
    const saveBtn = document.getElementById('save-task-btn');
    const editBtn = document.getElementById('edit-task-btn');
    const deleteBtn = document.getElementById('delete-task-btn');
    const cancelBtn = document.getElementById('cancel-task-btn');

    if (saveBtn) {
        saveBtn.addEventListener('click', handleTaskSave);
    }

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            openTaskModal('edit', currentTask);
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleTaskDelete);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('task-modal').classList.add('hide');
        });
    }
}

// Saving task
async function handleTaskSave() {
    const titleInput = document.getElementById('task-title');
    const descInput = document.getElementById('task-description');
    const estimatesInput = document.getElementById('task-estimates');
    const prioritySelect = document.getElementById('task-priority');
    const statusSelect = document.getElementById('task-status');

    const title = titleInput.value.trim();
    if (!title) {
        alert('Task title can\'t be empty!');
        return;
    }

    const taskData = {
        title: title,
        description: descInput.value.trim(),
        estimates: parseInt(estimatesInput.value) || 0,
        priority: prioritySelect.value,
        status: statusSelect.value
    };

    const saveBtn = document.getElementById('save-task-btn');

    try {
        setLoading(saveBtn, true);

        if (taskModalMode === 'create') {
            // Creating new task
            const boardId = sessionStorage.getItem('openedBoardId');
            if (!boardId) {
                alert('No board selected!');
                return;
            }

            taskData.boardId = boardId;

            const res = await fetch('/api/boards/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });

            if (!res.ok) throw new Error(`Error creating task. Status: ${res.status}`);

            document.getElementById('task-modal').classList.add('hide');
            loadTasksForBoard(boardId);

        } else if (taskModalMode === 'edit') {
            // Editing an existing task
            if (!currentTask || !currentTask._id) {
                alert('Task ID not found!');
                return;
            }

            const res = await fetch(`/api/boards/tasks/${currentTask._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });

            if (!res.ok) throw new Error(`Error updating task. Status: ${res.status}`);

            document.getElementById('task-modal').classList.add('hide');
            const boardId = sessionStorage.getItem('openedBoardId');
            if (boardId) {
                loadTasksForBoard(boardId);
            }
        }

    } catch (error) {
        console.error('Task save error:', error);
        alert(`Failed to save task: ${error.message}`);
    } finally {
        setLoading(saveBtn, false);
    }
}

// Task deletion
async function handleTaskDelete() {
    if (!currentTask || !currentTask._id) {
        alert('Task ID not found!');
        return;
    }

    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    const deleteBtn = document.getElementById('delete-task-btn');

    try {
        setLoading(deleteBtn, true);

        const res = await fetch(`/api/boards/tasks/${currentTask._id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error(`Error deleting task. Status: ${res.status}`);

        document.getElementById('task-modal').classList.add('hide');
        const boardId = sessionStorage.getItem('openedBoardId');
        if (boardId) {
            loadTasksForBoard(boardId);
        }

    } catch (error) {
        console.error('Task delete error:', error);
        alert(`Failed to delete task: ${error.message}`);
    } finally {
        setLoading(deleteBtn, false);
    }
}

// Filling the form with task data
function fillTaskForm(taskData) {
    if (!taskData) return;

    document.getElementById('task-title').value = taskData.title || '';
    document.getElementById('task-description').value = taskData.description || '';
    document.getElementById('task-estimates').value = taskData.estimates || 0;
    document.getElementById('task-priority').value = taskData.priority || 'medium';
    document.getElementById('task-status').value = taskData.status || 'To Do';
}

// Cleaning form
function clearTaskForm() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-estimates').value = '';
    document.getElementById('task-priority').value = 'medium';
    document.getElementById('task-status').value = 'To Do';
}

// Set read-only mode
function setTaskFormReadonly(readonly) {
    document.getElementById('task-title').readOnly = readonly;
    document.getElementById('task-description').readOnly = readonly;
    document.getElementById('task-estimates').readOnly = readonly;
    document.getElementById('task-priority').disabled = readonly;
    document.getElementById('task-status').disabled = readonly;
}

export function initBoards() {
    const container = document.querySelector('.boards-list');
    if (!container) return;

    const createTaskBtn = document.getElementById('create-task');
    if (createTaskBtn) {
        createTaskBtn.style.display = 'none';
    }

    fetchBoards(container);
    setupCreateBoardModal(container);
    setupCreateTaskModal(container);
    setupEditAndDeleteListeners(container);

    // Restore board from sessionStorage if available
    const lastBoardId = sessionStorage.getItem('openedBoardId');
    if (lastBoardId) {
        const interval = setInterval(() => {
            const card = container.querySelector(`.board-card[data-id="${lastBoardId}"]`);
            if (card) {
                enterEditMode(card);
                clearInterval(interval);
            }
        }, 50);
    }
}

async function fetchBoards(container) {
    try {
        const res = await fetch('/api/boards');
        if (!res.ok) throw new Error(`Failed to fetch boards. Status: ${res.status}`);

        const boards = await res.json();
        console.log('Boards from server:', boards);
        renderBoards(container, boards);
    } catch (err) {
        console.error('Error during loading boards:', err);
        alert(`Error during loading boards: ${err.message}`);
    }
}

function renderBoards(container, boards) {
    const emptyState = container.querySelector('.empty-state');

    const createTaskBtn = document.getElementById('create-task');
    if (createTaskBtn) {
        createTaskBtn.style.display = 'none';
    }

    // Hide empty-state by default
    if (emptyState) emptyState.style.display = 'none';

    // delete old board cards
    container.querySelectorAll('.board-card').forEach(el => el.remove());

    if (boards.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    boards.forEach(board => {
        const card = document.createElement('div');
        card.classList.add('board-card');
        card.dataset.id = board._id;
        card.innerHTML = `
            <div class="board-name-wrapper">
                <h2 class="board-name">${board.name}</h2>
            </div>
            <div class="board-actions">
                <button class="edit-board" data-id="${board._id}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-board" data-id="${board._id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(card);

        const editBtn = card.querySelector('.edit-board');
        editBtn.addEventListener('click', () => {
            enterEditMode(card);
        });

        card.addEventListener('dblclick', () => {
            enterEditMode(card);
        });

        const deleteBtn = card.querySelector('.delete-board');
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();

            // If we are in edit mode - do not process clicks on cards
            if (editingCard) return;

            const id = deleteBtn.dataset.id;
            const boardName = card.querySelector('.board-name')?.textContent || 'this board';

            if (!confirm(`Are you sure you want to delete "${boardName}"?`)) return;

            try {
                const res = await fetch(`/api/boards/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete board!');
                fetchBoards(container);
            } catch (err) {
                console.error('Delete board error:', err);
                alert('Error deleting board!');
            }
        });
    });
}

// Create Board. Modal window logic
function setupCreateBoardModal(container) {
    const createBtn = document.getElementById('create-board');
    const modal = document.getElementById('board-modal');
    const input = document.getElementById('board-name-input');
    const saveBtn = document.getElementById('save-board-btn');
    const cancelBtn = document.getElementById('cancel-board-btn');

    if (!createBtn || !modal || !input || !saveBtn || !cancelBtn) return;

    createBtn.addEventListener('click', () => {
        input.value = '';
        modal.classList.remove('hide');
        input.focus();
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hide');
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') saveBtn.click();
    });

    saveBtn.addEventListener('click', async () => {
        const name = input.value.trim();
        if (!name) return alert('Board name can\'t be empty!');

        const existingNames = Array.from(document.querySelectorAll('.board-name'))
            .map(el => normalizeName(el.textContent));

        if (existingNames.includes(normalizeName(name))) {
            alert('A board with this name already exists!');
            return;
        }

        try {
            setLoading(saveBtn, true);

            const res = await fetch('/api/boards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            if (!res.ok) throw new Error(`Error creating board. Status: ${res.status}`);

            await res.json();
            modal.classList.add('hide');
            input.value = '';
            fetchBoards(container);
        } catch (err) {
            console.error('Create board error:', err);
            alert(`Failed to create board: ${err.message}`);
        } finally {
            setLoading(saveBtn, false);
        }
    });
}

// Create Task Modal window logic
function setupCreateTaskModal(container) {
    const createTaskBtn = document.getElementById('create-task');
    const taskModal = document.getElementById('task-modal');
    const taskTitleInput = document.getElementById('task-title');

    if (!createTaskBtn || !taskModal || !taskTitleInput) {
        return;
    }

    createTaskBtn.addEventListener('click', () => {
        openTaskModal('create');
    });

    // Close modal window when clicking outside of it
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            taskModal.classList.add('hide');
        }
    });

    taskTitleInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && taskModalMode === 'create') {
            const saveBtn = document.getElementById('save-task-btn');
            if (saveBtn) saveBtn.click();
        }
    });
}

// Edit/Delete Board Listeners
function setupEditAndDeleteListeners(container) {
    const saveBtn = document.getElementById('save-board');
    const closeBtn = document.getElementById('close-board');
    const createBtn = document.getElementById('create-board');
    const createTaskBtn = document.getElementById('create-task');
    const deleteBtn = document.getElementById('delete-board');

    // Remove all old handlers to avoid duplication
    if (boundDeleteEditHandler) {
        closeBtn.removeEventListener('click', boundDeleteEditHandler);
    }

    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    const newDeleteBtn = deleteBtn.cloneNode(true);
    deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

    // Create a new handler for Close
    boundDeleteEditHandler = () => {
        if (!editingCard) return;
        editingCard = null;
        fetchBoards(container);
        newSaveBtn.disabled = true;
        closeBtn.disabled = true;
        createBtn.style.display = 'block';
        createTaskBtn.style.display = 'none';
        newSaveBtn.style.display = 'none';
        closeBtn.style.display = 'none';
        newDeleteBtn.style.display = 'none';
        sessionStorage.removeItem('openedBoardId');
    };

    closeBtn.addEventListener('click', boundDeleteEditHandler);

    // Delete button with ID (delete open board)
    newDeleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();

        if (!editingCard) return;

        const boardId = editingCard.dataset.id;
        const boardName = editingCard.querySelector('.board-name')?.textContent ||
            editingCard.querySelector('.board-edit-input')?.value || 'this board';

        if (!confirm(`Are you sure you want to delete "${boardName}"?`)) return;

        try {
            setLoading(newDeleteBtn, true);

            const res = await fetch(`/api/boards/${boardId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error(`Failed to delete board. Status: ${res.status}`);

            // Close the editing mode and update the list
            editingCard = null;
            sessionStorage.removeItem('openedBoardId');

            // Reset the state of the buttons
            newSaveBtn.disabled = true;
            closeBtn.disabled = true;
            createBtn.style.display = 'block';
            createTaskBtn.style.display = 'none';
            newSaveBtn.style.display = 'none';
            closeBtn.style.display = 'none';
            newDeleteBtn.style.display = 'none';

            // Updating the list of boards
            fetchBoards(container);

            console.log(`Board ${boardId} deleted successfully`);

        } catch (error) {
            console.error('Delete board error:', error);
            alert(`Error deleting board: ${error.message}`);
        } finally {
            setLoading(newDeleteBtn, false);
        }
    });

    newSaveBtn.addEventListener('click', async () => {
        const input = document.querySelector('.board-edit-input');
        if (!input || !editingCard) return;

        // Check that input is still in edit mode
        if (input.dataset.editing === 'false') return;

        const newName = input.value.trim();
        if (!newName) {
            alert('Board name cannot be empty!');
            return;
        }

        try {
            setLoading(newSaveBtn, true);

            const boardId = editingCard.dataset.id;
            const res = await fetch(`/api/boards/${boardId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });

            if (!res.ok) throw new Error(`Error updating board name. Status: ${res.status}`);

            if (!document.contains(input)) {
                console.log('Input was already replaced, skipping DOM update');
                return;
            }

            // Replace input back to h2 with a new name
            const newH2 = document.createElement('h2');
            newH2.className = 'board-name';
            newH2.textContent = newName;

            // Add a click handler for the new h2
            function setupNewBoardNameEditor(h2Element) {
                h2Element.addEventListener('click', () => {
                    const editInput = document.createElement('input');
                    editInput.type = 'text';
                    editInput.className = 'board-edit-input';
                    editInput.value = h2Element.textContent;
                    editInput.dataset.editing = 'true';

                    h2Element.replaceWith(editInput);
                    editInput.focus();

                    editInput.addEventListener('keydown', e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            newSaveBtn.click();
                        }
                        if (e.key === 'Escape') {
                            editInput.dataset.editing = 'false';
                            const restoreH2 = document.createElement('h2');
                            restoreH2.className = 'board-name';
                            restoreH2.textContent = h2Element.textContent;
                            editInput.replaceWith(restoreH2);
                            setupNewBoardNameEditor(restoreH2);
                        }
                    });
                });
            }

            setupNewBoardNameEditor(newH2);
            input.replaceWith(newH2);

            console.log(`Board renamed to: ${newName}`);

        } catch (error) {
            console.error('Error updating board name:', error);
            alert(`Failed to update board name: ${error.message}`);
        } finally {
            setLoading(newSaveBtn, false);
        }
    });
}

// Convert a string to lowercase and remove spaces
function normalizeName(str) {
    return str.toLowerCase().trim();
}

// Lock button and change text
function setLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        const originalContent = button.innerHTML;
        button.dataset.originalContent = originalContent;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    } else {
        button.disabled = false;
        const originalContent = button.dataset.originalContent;
        if (originalContent) {
            button.innerHTML = originalContent;
        } else {
            button.innerHTML = '<i class="fas fa-save"></i> Save';
        }
    }
}
