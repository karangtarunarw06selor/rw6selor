import { normalizeCategory } from "./lomba-storage.js";

// Domain biz.id hanya frontend — backend hanya di web.id
// Semua request API harus cross-domain ke web.id
const API_BASE = "https://rw6selor.org/common/api";

const jsonHeaders = { "Content-Type": "application/json" };

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.message || `API gagal: ${response.status}`);
  }
  return payload;
};

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options
  });
  return parseResponse(response);
};

export const api = {
  async getParticipants() {
    const payload = await request(`${API_BASE}/participants.php`);
    return (payload.data || []).map((participant) => ({
      id: String(participant.id),
      name: participant.name,
      gender: participant.gender,
      category: normalizeCategory(participant.age_category || participant.category)
    }));
  },

  async createParticipant(participant) {
    return request(`${API_BASE}/participants.php`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        name: participant.name,
        gender: participant.gender,
        age_category: normalizeCategory(participant.category)
      })
    });
  },

  async updateParticipant(id, participant) {
    return request(`${API_BASE}/participants.php?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify({
        name: participant.name,
        gender: participant.gender,
        age_category: normalizeCategory(participant.category)
      })
    });
  },

  async deleteParticipant(id) {
    return request(`${API_BASE}/participants.php?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  },

  async deleteAllParticipants() {
    return request(`${API_BASE}/participants.php?all=1`, {
      method: "DELETE"
    });
  },

  async getBracket() {
    return request(`${API_BASE}/bracket.php`);
  },

  async getCompletedBrackets(search = "") {
    const query = new URLSearchParams({ status: "completed" });
    if (search) query.set("search", search);
    return request(`${API_BASE}/bracket.php?${query.toString()}`);
  },

  async getBracketById(id) {
    return request(`${API_BASE}/bracket.php?id=${encodeURIComponent(id)}`);
  },

  async saveBracket({ settings, bracket, podium, status = "draft" }) {
    return request(`${API_BASE}/bracket.php`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        name: settings?.competitionName || bracket?.competitionName || "Draft Lomba",
        settings,
        bracket,
        podium,
        status
      })
    });
  },

  async getPublish() {
    return request(`${API_BASE}/publish.php`);
  },

  async togglePublish({ active, settings, bracket, podium }) {
    return request(`${API_BASE}/publish.php`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        is_active: active ? 1 : 0,
        settings,
        bracket,
        podium
      })
    });
  }
};

window.LombaAPI = api;