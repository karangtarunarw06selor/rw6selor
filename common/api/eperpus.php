<?php
/**
 * E-Perpustakaan API Endpoint
 * RW06 Selor
 * 
 * Menggantikan Google Apps Script Web App
 * 
 * Endpoint:
 *   GET  ?email=xxx  → Login/verifikasi anggota
 *   GET  ?aksi=pingAktif&namaUser=xxx  → Ping online status
 *   POST → Tambah request buku baru
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/eperpus_helpers.php';

try {
    $pdo = $pdo;
    eperpus_ensure_schema($pdo);
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    // ========== POST: Tambah request buku ==========
    if ($method === 'POST') {
        $input = eperpus_json_input();
        if (empty($input)) {
            $input = $_POST;
        }
        
        $aksi = $input['aksi'] ?? '';
        if ($aksi !== 'tambahRequestBuku') {
            eperpus_json_response(['status' => 'error', 'message' => 'Aksi tidak valid.'], 400);
        }
        
        $judul = trim((string)($input['judulBuku'] ?? ''));
        $penulis = trim((string)($input['penulisBuku'] ?? ''));
        $pengusul = trim((string)($input['namaPengusul'] ?? ''));
        
        if ($judul === '') {
            eperpus_json_response(['status' => 'error', 'message' => 'Judul buku wajib diisi.'], 400);
        }
        
        $requests = eperpus_submit_request($pdo, $judul, $penulis, $pengusul);
        
        eperpus_json_response([
            'status' => 'success',
            'message' => 'Usulan request buku berhasil dikirim.',
            'requests' => $requests,
        ]);
    }
    
    // ========== GET: Login atau Ping ==========
    $aksi = $_GET['aksi'] ?? '';
    
    if ($aksi === 'pingAktif') {
        $namaUser = trim((string)($_GET['namaUser'] ?? ''));
        if ($namaUser === '') {
            eperpus_json_response(['status' => 'error', 'message' => 'Nama user diperlukan.'], 400);
        }
        
        $onlineUsers = eperpus_ping_online($pdo, $namaUser);
        
        eperpus_json_response([
            'status' => 'success',
            'onlineUsers' => $onlineUsers,
        ]);
    }
    
    // Default GET: Login / verifikasi anggota
    $email = trim((string)($_GET['email'] ?? ''));
    if ($email === '') {
        eperpus_json_response(['status' => 'error', 'message' => 'Email diperlukan.'], 400);
    }
    
    $member = eperpus_verify_member($pdo, $email);
    
    if (empty($member)) {
        eperpus_json_response(['status' => 'unauthorized', 'message' => 'Email tidak ditemukan.']);
    }
    
    $books = eperpus_get_books($pdo);
    $requests = eperpus_get_requests($pdo);
    
    eperpus_json_response([
        'status' => 'authorized',
        'nama' => $member['nama'],
        'nim' => $member['nim'],
        'email' => $email,
        'buku' => $books,
        'requests' => $requests,
    ]);
    
} catch (Exception $e) {
    eperpus_json_response([
        'status' => 'error',
        'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
    ], 500);
}