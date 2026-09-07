import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;
  private recentMessages = new Map<string, number>();

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', duration = 4000) {
    if (!message || !message.trim()) return;

    // Prevent immediate duplicate alerts within 1.2 seconds
    const key = `${type}::${message.trim()}`;
    const now = Date.now();
    const prev = this.recentMessages.get(key);
    if (prev && now - prev < 1200) {
      return;
    }
    this.recentMessages.set(key, now);

    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, message: message.trim(), type, duration }]);
  }

  success(message: string, duration = 4000) { this.show(message, 'success', duration); }
  error(message: string, duration = 4000) { this.show(message, 'error', duration); }
  info(message: string, duration = 4000) { this.show(message, 'info', duration); }
  warning(message: string, duration = 4000) { this.show(message, 'warning', duration); }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}
