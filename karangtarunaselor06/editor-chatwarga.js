/**
 * Editor Pengguna Chat Warga
 * Mengelola pengguna yang terdaftar di warga_chat_users
 * Dan mengelola pesan (edit/hapus) untuk admin
 */
function getChatWargaApiBase() {
    return '/common/api';
}

class ChatWargaEditor {
    constructor() {
        const base = getChatWargaApiBase();
        this.apiUrlUsers = base + '/warga_chat_users_list.php';
        this.apiUrlUsersDelete = base + '/warga_chat_users_delete.php';
        this.apiUrlMessages = base + '/warga-chat.php';
        
        this.currentTab = 'users';
        this.currentVisibleUserCount = 0;
        this.initElements();
        this.bindEvents();
        this.loadUsers();
    }

    initElements() {
        this.alert = document.getElementById('chatAdminAlert');
        this.searchInput = document.getElementById('chatSearchInput');
        this.memberFilter = document.getElementById('chatMemberFilter');
        this.tableBody = document.getElementById('chatUsersTableBody');
        
        // Delete User Overlay
        this.deleteOverlay = document.getElementById('chatDeleteOverlay');
        this.deleteCloseBtn = document.getElementById('chatDeleteCloseBtn');
        this.deleteName = document.getElementById('chatDeleteName');
        this.deleteMessagesCheckbox = document.getElementById('deleteChatMessages');
        this.deleteConfirmInput = document.getElementById('chatDeleteConfirmInput');
        this.deleteCancelBtn = document.getElementById('chatDeleteCancelBtn');
        this.deleteSubmitBtn = document.getElementById('chatDeleteSubmitBtn');
        this.deleteCheckboxWrap = document.querySelector('.chat-delete-checkbox');
        this.deleteHint = document.querySelector('.chat-delete-hint');
        
        // Message Management
        this.messageSearchInput = document.getElementById('messageSearchInput');
        this.messageDateInput = document.getElementById('messageDateInput');
        this.messageTableBody = document.getElementById('messagesTableBody');
        this.loadMessagesBtn = document.getElementById('loadMessagesBtn');

        // Edit User Overlay
        this.editUserOverlay = document.getElementById('editUserOverlay');
        this.editUserCloseBtn = document.getElementById('editUserCloseBtn');
        this.editUserId = document.getElementById('editUserId');
        this.editUserNameInput = document.getElementById('editUserNameInput');
        this.editUserCancelBtn = document.getElementById('editUserCancelBtn');
        this.editUserSubmitBtn = document.getElementById('editUserSubmitBtn');
        
        // Edit Message Overlay
        this.editOverlay = document.getElementById('editMessageOverlay');
        this.editCloseBtn = document.getElementById('editMessageCloseBtn');
        this.editMessageId = document.getElementById('editMessageId');
        this.editMessageText = document.getElementById('editMessageText');
        this.editCancelBtn = document.getElementById('editCancelBtn');
        this.editSubmitBtn = document.getElementById('editSubmitBtn');
        
        // Delete Message Overlay
        this.deleteMessageOverlay = document.getElementById('deleteMessageOverlay');
        this.deleteMessageCloseBtn = document.getElementById('deleteMessageCloseBtn');
        this.deleteMessageText = document.getElementById('deleteMessageText');
        this.deleteMessageCancelBtn = document.getElementById('deleteMessageCancelBtn');
        this.deleteMessageSubmitBtn = document.getElementById('deleteMessageSubmitBtn');
        
        // Tabs
        this.tabUsers = document.getElementById('tabUsers');
        this.tabMessages = document.getElementById('tabMessages');
        this.panelUsers = document.getElementById('panelUsers');
        this.panelMessages = document.getElementById('panelMessages');
        
        this.currentDeleteUserId = null;
        this.currentDeleteMessageId = null;
        this.currentEditMessageId = null;
        this.currentEditUserId = null;
        this.currentEditUserOriginalName = '';
    }

    bindEvents() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.loadUsers());
        }
        if (this.memberFilter) {
            this.memberFilter.addEventListener('change', () => this.loadUsers());
        }
        
        if (this.deleteCloseBtn) {
            this.deleteCloseBtn.addEventListener('click', () => this.closeDeleteDialog());
        }
        if (this.deleteCancelBtn) {
            this.deleteCancelBtn.addEventListener('click', () => this.closeDeleteDialog());
        }
        
        if (this.deleteConfirmInput && this.deleteSubmitBtn) {
            this.deleteConfirmInput.addEventListener('input', (e) => {
                this.deleteSubmitBtn.disabled = e.target.value.trim().toLowerCase() !== 'hapus';
            });
        }
        
        if (this.deleteSubmitBtn) {
            this.deleteSubmitBtn.addEventListener('click', () => this.confirmDelete());
        }

        if (this.deleteCheckboxWrap) {
            this.deleteCheckboxWrap.hidden = true;
        }
        if (this.deleteHint) {
            this.deleteHint.textContent = 'Ketik "hapus" untuk menyembunyikan satu baris dari daftar pengguna.';
        }

        if (this.editUserCloseBtn) {
            this.editUserCloseBtn.addEventListener('click', () => this.closeEditUserDialog());
        }
        if (this.editUserCancelBtn) {
            this.editUserCancelBtn.addEventListener('click', () => this.closeEditUserDialog());
        }
        if (this.editUserSubmitBtn) {
            this.editUserSubmitBtn.addEventListener('click', () => this.confirmEditUserName());
        }
        if (this.editUserNameInput) {
            this.editUserNameInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.confirmEditUserName();
                }
            });
        }
        
        // Message management events
        if (this.loadMessagesBtn) {
            this.loadMessagesBtn.addEventListener('click', () => this.loadMessages());
        }
        if (this.messageDateInput) {
            this.messageDateInput.addEventListener('change', () => this.loadMessages());
        }
        
        // Edit message overlay
        if (this.editCloseBtn) {
            this.editCloseBtn.addEventListener('click', () => this.closeEditMessageDialog());
        }
        if (this.editCancelBtn) {
            this.editCancelBtn.addEventListener('click', () => this.closeEditMessageDialog());
        }
        if (this.editSubmitBtn) {
            this.editSubmitBtn.addEventListener('click', () => this.confirmEditMessage());
        }
        
        // Delete message overlay
        if (this.deleteMessageCloseBtn) {
            this.deleteMessageCloseBtn.addEventListener('click', () => this.closeDeleteMessageDialog());
        }
        if (this.deleteMessageCancelBtn) {
            this.deleteMessageCancelBtn.addEventListener('click', () => this.closeDeleteMessageDialog());
        }
        if (this.deleteMessageSubmitBtn) {
            this.deleteMessageSubmitBtn.addEventListener('click', () => this.confirmDeleteMessage());
        }
        
        // Tab switching
        if (this.tabUsers) {
            this.tabUsers.addEventListener('click', () => this.switchTab('users'));
        }
        if (this.tabMessages) {
            this.tabMessages.addEventListener('click', () => this.switchTab('messages'));
        }
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        if (this.messageDateInput) {
            this.messageDateInput.value = today;
        }
    }

    switchTab(tab) {
        this.currentTab = tab;
        if (this.tabUsers) this.tabUsers.classList.toggle('active', tab === 'users');
        if (this.tabMessages) this.tabMessages.classList.toggle('active', tab === 'messages');
        if (this.panelUsers) this.panelUsers.hidden = tab !== 'users';
        if (this.panelMessages) this.panelMessages.hidden = tab !== 'messages';
        
        if (tab === 'messages') {
            this.loadMessages();
        }
    }

    async loadUsers() {
        if (!this.tableBody) return;
        
        this.tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Memuat data...</td></tr>';
        
        const search = this.searchInput ? this.searchInput.value : '';
        const filter = this.memberFilter ? this.memberFilter.value : '';
        
        try {
            const response = await fetch(`${this.apiUrlUsers}?search=${encodeURIComponent(search)}&member_filter=${filter}`);
            const res = await response.json();
            
            if (res.ok) {
                this.renderTable(res.data);
            } else {
                this.showAlert(res.message, 'error');
            }
        } catch (error) {
            this.showAlert('Gagal memuat data pengguna.', 'error');
        }
    }

    renderTable(users) {
        this.currentVisibleUserCount = users.length;

        if (users.length === 0) {
            this.tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Tidak ada pengguna ditemukan.</td></tr>';
            return;
        }

        this.tableBody.innerHTML = '';
        const canDeleteRows = users.length > 1;
        users.forEach(user => {
            const row = document.createElement('tr');
            
            const dateStr = user.last_message_at 
                ? new Date(user.last_message_at).toLocaleString('id-ID') 
                : '-';

            row.innerHTML = `
                <td><small>${this.escapeHtml(user.device_id)}</small></td>
                <td><strong>${this.escapeHtml(user.display_name)}</strong></td>
                <td>
                    <span class="badge ${user.is_member ? 'badge-success' : 'badge-secondary'}">
                        ${user.is_member ? 'Anggota' : 'Tamu'}
                    </span>
                </td>
                <td>${user.message_count || 0} pesan</td>
                <td><small>${dateStr}</small></td>
                <td>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn-action btn-toggle" data-id="${user.id}" title="Edit Nama Pengguna">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-action btn-delete" data-id="${user.id}" title="${canDeleteRows ? 'Sembunyikan Baris Pengguna' : 'Baris terakhir tidak bisa dihapus'}" ${canDeleteRows ? '' : 'disabled'}>
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            row.querySelector('.btn-toggle').addEventListener('click', () => this.editDisplayName(user));
            row.querySelector('.btn-delete').addEventListener('click', () => this.openDeleteDialog(user));
            
            this.tableBody.appendChild(row);
        });
    }

    async editDisplayName(user) {
        this.openEditUserDialog(user);
    }

    openEditUserDialog(user) {
        this.currentEditUserId = user.id;
        this.currentEditUserOriginalName = String(user.display_name || '').trim();

        if (this.editUserId) {
            this.editUserId.value = String(user.id);
        }
        if (this.editUserNameInput) {
            this.editUserNameInput.value = this.currentEditUserOriginalName;
        }
        if (this.editUserOverlay) {
            this.editUserOverlay.hidden = false;
        }
        setTimeout(() => {
            this.editUserNameInput?.focus();
            this.editUserNameInput?.select();
        }, 40);
    }

    closeEditUserDialog() {
        if (this.editUserOverlay) {
            this.editUserOverlay.hidden = true;
        }
        this.currentEditUserId = null;
        this.currentEditUserOriginalName = '';
    }

    async confirmEditUserName() {
        const userId = this.currentEditUserId;
        if (!userId || !this.editUserNameInput) return;

        const newName = this.editUserNameInput.value.trim().replace(/\s+/g, ' ');
        if (!newName) {
            this.showAlert('Nama tidak boleh kosong.', 'error');
            this.editUserNameInput.focus();
            return;
        }
        if (newName === this.currentEditUserOriginalName) {
            this.closeEditUserDialog();
            return;
        }

        try {
            const response = await fetch(this.apiUrlUsersDelete, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'edit_name', id: userId, display_name: newName })
            });
            const res = await response.json();
            
            if (res.ok) {
                this.showAlert(res.message, 'success');
                this.closeEditUserDialog();
                this.loadUsers();
            } else {
                this.showAlert(res.message, 'error');
            }
        } catch (error) {
            this.showAlert('Gagal memperbarui nama pengguna.', 'error');
        }
    }

    async openDeleteDialog(user) {
        if (this.currentVisibleUserCount <= 1) {
            this.showAlert('Baris terakhir tidak bisa dihapus agar minimal satu nama tetap tersimpan.', 'error');
            return;
        }

        this.currentDeleteUserId = user.id;
        if (window.createDeleteConfirmToast) {
            const confirmed = await window.createDeleteConfirmToast({
                title: 'Sembunyikan Pengguna?',
                message: `Baris <strong>${user.display_name}</strong> akan disembunyikan dari daftar pengguna chat warga.`,
                confirmLabel: 'Sembunyikan',
                requireWord: 'hapus'
            });
            if (!confirmed || !confirmed.confirmed) {
                this.currentDeleteUserId = null;
                return;
            }
            await this.confirmDelete();
            return;
        }

        this.deleteName.textContent = user.display_name;
        this.deleteConfirmInput.value = '';
        this.deleteSubmitBtn.disabled = true;
        if (this.deleteMessagesCheckbox) {
            this.deleteMessagesCheckbox.checked = false;
        }
        this.deleteOverlay.hidden = false;
    }

    closeDeleteDialog() {
        this.deleteOverlay.hidden = true;
        this.currentDeleteUserId = null;
    }

    async confirmDelete() {
        if (!this.currentDeleteUserId) return;
        
        try {
            const response = await fetch(this.apiUrlUsersDelete, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    mode: 'delete', 
                    id: this.currentDeleteUserId
                })
            });
            const res = await response.json();
            
            if (res.ok) {
                this.showAlert(res.message, 'success');
                this.closeDeleteDialog();
                this.loadUsers();
            } else {
                this.showAlert(res.message, 'error');
            }
        } catch (error) {
            this.showAlert('Gagal menghapus pengguna.', 'error');
        }
    }

    async loadMessages() {
        if (!this.messageDateInput || !this.messageTableBody) return;
        
        const date = this.messageDateInput.value;
        if (!date) {
            this.showAlert('Pilih tanggal terlebih dahulu.', 'error');
            return;
        }
        
        this.messageTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Memuat pesan...</td></tr>';
        
        try {
            const response = await fetch(`${this.apiUrlMessages}?action=history&date=${encodeURIComponent(date)}`);
            const res = await response.json();
            
            if (res.ok) {
                this.renderMessages(res.data);
            } else {
                this.showAlert(res.message, 'error');
            }
        } catch (error) {
            this.showAlert('Gagal memuat pesan.', 'error');
        }
    }

    renderMessages(messages) {
        if (messages.length === 0) {
            this.messageTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Tidak ada pesan pada tanggal ini.</td></tr>';
            return;
        }

        this.messageTableBody.innerHTML = '';
        messages.forEach(msg => {
            const row = document.createElement('tr');
            
            const timeStr = new Date(msg.created_at).toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            row.innerHTML = `
                <td><small>${this.escapeHtml(msg.device_id)}</small></td>
                <td><strong>${this.escapeHtml(msg.display_name)}</strong></td>
                <td>${msg.is_member ? '<span class="badge badge-success">Anggota</span>' : '<span class="badge badge-secondary">Tamu</span>'}</td>
                <td>${this.escapeHtml(msg.message).substring(0, 50)}${msg.message.length > 50 ? '...' : ''}</td>
                <td><small>${timeStr}</small></td>
                <td>${msg.is_edited ? '<span class="badge badge-warning">Edited</span>' : ''}</td>
                <td>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn-action btn-edit-msg" data-id="${msg.id}" title="Edit Pesan">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-action btn-delete-msg" data-id="${msg.id}" title="Hapus Pesan" style="color: #f44336;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            row.querySelector('.btn-edit-msg').addEventListener('click', () => this.openEditMessageDialog(msg));
            row.querySelector('.btn-delete-msg').addEventListener('click', () => this.openDeleteMessageDialog(msg));
            
            this.messageTableBody.appendChild(row);
        });
    }

    openEditMessageDialog(msg) {
        this.currentEditMessageId = msg.id;
        this.editMessageId.value = msg.id;
        this.editMessageText.value = msg.message;
        this.editOverlay.hidden = false;
    }

    closeEditMessageDialog() {
        this.editOverlay.hidden = true;
        this.currentEditMessageId = null;
    }

    async confirmEditMessage() {
        const newText = this.editMessageText.value.trim();
        if (!newText) {
            this.showAlert('Pesan tidak boleh kosong.', 'error');
            return;
        }

        try {
            const response = await fetch(this.apiUrlMessages, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'admin_edit_message',
                    message_id: this.currentEditMessageId,
                    message: newText
                })
            });
            const res = await response.json();
            
            if (res.ok) {
                this.showAlert('Pesan berhasil diperbarui.', 'success');
                this.closeEditMessageDialog();
                this.loadMessages();
            } else {
                this.showAlert(res.message, 'error');
            }
        } catch (error) {
            this.showAlert('Gagal mengedit pesan.', 'error');
        }
    }

    async openDeleteMessageDialog(msg) {
        this.currentDeleteMessageId = msg.id;
        const shortText = msg.message.substring(0, 100) + (msg.message.length > 100 ? '...' : '');
        if (window.createDeleteConfirmToast) {
            const confirmed = await window.createDeleteConfirmToast({
                title: 'Hapus Pesan?',
                message: `Pesan berikut akan dihapus:<br><br><em>${shortText}</em>`,
                confirmLabel: 'Hapus',
                requireWord: 'hapus'
            });
            if (!confirmed || !confirmed.confirmed) {
                this.currentDeleteMessageId = null;
                return;
            }
            await this.confirmDeleteMessage();
            return;
        }
        this.deleteMessageText.textContent = shortText;
        this.deleteMessageOverlay.hidden = false;
    }

    closeDeleteMessageDialog() {
        this.deleteMessageOverlay.hidden = true;
        this.currentDeleteMessageId = null;
    }

    async confirmDeleteMessage() {
        if (!this.currentDeleteMessageId) return;

        try {
            const response = await fetch(this.apiUrlMessages, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'admin_delete_message',
                    message_id: this.currentDeleteMessageId
                })
            });
            const res = await response.json();
            
            if (res.ok) {
                this.showAlert('Pesan berhasil dihapus.', 'success');
                this.closeDeleteMessageDialog();
                this.loadMessages();
            } else {
                this.showAlert(res.message, 'error');
            }
        } catch (error) {
            this.showAlert('Gagal menghapus pesan.', 'error');
        }
    }

    showAlert(msg, type) {
        if (!this.alert) return;
        
        this.alert.textContent = msg;
        this.alert.className = `member-alert alert-${type}`;
        this.alert.style.display = 'block';
        setTimeout(() => {
            if (this.alert) {
                this.alert.style.display = 'none';
            }
        }, 4000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.chatWargaEditor = new ChatWargaEditor();
});
