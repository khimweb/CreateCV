import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  UserPlus,
  Trash2,
  Search,
  FolderOpen,
  Users,
  CheckCircle2,
  XCircle,
  Shield,
  ShieldCheck,
  FileText,
  RefreshCw,
  X,
  ChevronRight,
  ChevronDown,
  Mail,
  Calendar,
  Clock,
  Check,
  AlertCircle,
  ArrowUpDown,
  Sparkles,
  ArrowUpRight,
  Eye,
  EyeOff
} from 'lucide-angular';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AuthService } from '../../../core/services/auth.service';

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean | number;
  last_login_at: string | null;
  created_at: string;
  cv_count: number;
  avatar_url: string | null;
}

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-8 pb-12">
      <!-- Top Executive Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-2xl border border-indigo-500/20">
        <!-- Ambient Decorative Glows -->
        <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none"></div>
        <div class="absolute right-1/3 -bottom-20 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <lucide-icon [img]="Users" class="w-3.5 h-3.5" />
              <span>Platform Membership Directory</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              User Management
              <span class="text-sm font-semibold px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {{ total() }} total
              </span>
            </h1>
            <p class="text-slate-300 text-sm max-w-xl">
              Inspect user accounts, manage permission roles, toggle platform access instantly, and audit saved CV drafts.
            </p>
          </div>

          <!-- Actions Header -->
          <div class="flex flex-wrap items-center gap-3">
            <button type="button" (click)="load()" [disabled]="isLoading()"
                    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer">
              <lucide-icon [img]="RefreshCw" class="w-4 h-4" [class.animate-spin]="isLoading()" />
              <span>Refresh</span>
            </button>

            <button type="button" (click)="showAddUser.set(true)"
                    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200 cursor-pointer">
              <lucide-icon [img]="UserPlus" class="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. Total Registered Users -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
              <lucide-icon [img]="Users" class="w-5 h-5" />
            </div>
            <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">
              All Time
            </span>
          </div>
          <p class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {{ total() }}
          </p>
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Total Registered Accounts</p>
        </div>

        <!-- 2. Active Accounts -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
              <lucide-icon [img]="CheckCircle2" class="w-5 h-5" />
            </div>
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {{ activePercentage() }}% Active
            </span>
          </div>
          <p class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {{ activeCount() }}
          </p>
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Enabled & Operational</p>
        </div>

        <!-- 3. Saved CVs Portfolio -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
              <lucide-icon [img]="FileText" class="w-5 h-5" />
            </div>
            <span class="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full">
              Drafts
            </span>
          </div>
          <p class="text-3xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
            {{ savedCvCount() }}
          </p>
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">CV Resumes Created</p>
        </div>

        <!-- 4. Quick Add User Interactive Card -->
        <button type="button" (click)="showAddUser.set(true)"
                class="group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-500/5 hover:bg-indigo-50/90 dark:hover:bg-indigo-500/15 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer">
          <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-2 group-hover:scale-110 duration-200">
            <lucide-icon [img]="UserPlus" class="w-5 h-5" />
          </div>
          <span class="text-sm font-bold text-indigo-700 dark:text-indigo-300">Add New Account</span>
          <span class="text-[11px] text-slate-500 dark:text-slate-400">Create login credentials</span>
        </button>
      </section>

      <!-- Control Toolbar: Filter Tabs, Search & Sort -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <!-- Filter Tabs -->
        <div class="inline-flex p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-inner overflow-x-auto">
          <button type="button" (click)="activeTab.set('all')"
                  [ngClass]="activeTab() === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'"
                  class="px-4 py-2 rounded-xl text-xs transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer shrink-0">
            <span>All Users</span>
            <span class="px-2 py-0.5 rounded-full text-[10px]"
                  [ngClass]="activeTab() === 'all' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-300 font-bold' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
              {{ total() }}
            </span>
          </button>

          <button type="button" (click)="activeTab.set('active')"
                  [ngClass]="activeTab() === 'active' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'"
                  class="px-4 py-2 rounded-xl text-xs transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer shrink-0">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Active</span>
            <span class="px-2 py-0.5 rounded-full text-[10px]"
                  [ngClass]="activeTab() === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300 font-bold' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
              {{ activeCount() }}
            </span>
          </button>

          <button type="button" (click)="activeTab.set('inactive')"
                  [ngClass]="activeTab() === 'inactive' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'"
                  class="px-4 py-2 rounded-xl text-xs transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer shrink-0">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Disabled</span>
            <span class="px-2 py-0.5 rounded-full text-[10px]"
                  [ngClass]="activeTab() === 'inactive' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/30 dark:text-rose-300 font-bold' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
              {{ inactiveCount() }}
            </span>
          </button>

          <button type="button" (click)="activeTab.set('admins')"
                  [ngClass]="activeTab() === 'admins' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'"
                  class="px-4 py-2 rounded-xl text-xs transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer shrink-0">
            <lucide-icon [img]="ShieldCheck" class="w-3 h-3 text-purple-500" />
            <span>Admins</span>
            <span class="px-2 py-0.5 rounded-full text-[10px]"
                  [ngClass]="activeTab() === 'admins' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/30 dark:text-purple-300 font-bold' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
              {{ adminCount() }}
            </span>
          </button>
        </div>

        <!-- Search & Sort Controls -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Search Input -->
          <div class="relative flex-1 sm:w-72 search-wrapper-animated">
            <lucide-icon [img]="Search" class="search-icon-animated absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors pointer-events-none" />
            <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Search name, email, ID..."
                   class="w-full pl-10 pr-9 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs md:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 shadow-sm" />
            @if (search) {
              <button type="button" (click)="search = ''; load()"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <lucide-icon [img]="X" class="w-3.5 h-3.5" />
              </button>
            }
          </div>

          <!-- Sort Selector -->
          <div class="relative">
            <select [(ngModel)]="sortBy"
                    class="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 shadow-sm cursor-pointer">
              <option value="newest">Newest Joined</option>
              <option value="oldest">Oldest Joined</option>
              <option value="cvs">Most CVs</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
            <lucide-icon [img]="ArrowUpDown" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <!-- User Directory Table Card -->
      <div class="rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden transition-all duration-300">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <!-- Table Header -->
            <thead class="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="px-6 py-4">User Profile</th>
                <th class="px-6 py-4">Role</th>
                <th class="px-6 py-4">Portfolio</th>
                <th class="px-6 py-4">Account Access</th>
                <th class="px-6 py-4">Last Active</th>
                <th class="px-6 py-4 text-right">Quick Actions</th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60">
              @if (filteredUsers().length === 0) {
                <tr>
                  <td colspan="6" class="p-12 text-center">
                    <div class="max-w-xs mx-auto space-y-3">
                      <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                        <lucide-icon [img]="Users" class="w-6 h-6" />
                      </div>
                      <p class="font-bold text-slate-800 dark:text-white text-base">No Users Found</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400">
                        @if (search) {
                          No users match your search query "{{ search }}".
                        } @else {
                          No accounts match this filter tab.
                        }
                      </p>
                      @if (search) {
                        <button type="button" (click)="search = ''; load()"
                                class="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold transition-all">
                          Clear Search
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @else {
                @for (u of filteredUsers(); track u.id) {
                  <tr class="group hover:bg-indigo-50/40 dark:hover:bg-slate-700/30 transition-all duration-200">
                    <!-- User Profile Column -->
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3.5">
                        <!-- Avatar or Gradient Monogram -->
                        @if (u.avatar_url) {
                          <img [src]="u.avatar_url" [alt]="u.full_name"
                               class="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 group-hover:ring-2 group-hover:ring-indigo-500/30 transition-all duration-200" />
                        } @else {
                          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-200">
                            {{ u.full_name ? u.full_name.slice(0, 1) : 'U' }}
                          </div>
                        }

                        <div class="min-w-0">
                          <p class="font-bold text-slate-900 dark:text-white text-sm truncate flex items-center gap-1.5">
                            <span>{{ u.full_name || 'Unnamed User' }}</span>
                            @if (u.role === 'admin') {
                              <span title="Administrator">
                                <lucide-icon [img]="ShieldCheck" class="w-3.5 h-3.5 text-indigo-500 inline" />
                              </span>
                            }
                          </p>
                          <p class="text-xs text-slate-400 dark:text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <lucide-icon [img]="Mail" class="w-3 h-3" />
                            <span>{{ u.email }}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <!-- Role Column -->
                    <td class="px-6 py-4">
                      <div class="relative inline-flex items-center">
                        <select [value]="u.role"
                                (change)="onRoleChange(u, $event)"
                                [disabled]="isCurrentUser(u)"
                                [title]="isCurrentUser(u) ? 'You cannot change your own admin role' : 'Change user role & platform privileges'"
                                class="appearance-none pl-7 pr-7 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
                                [ngClass]="u.role === 'admin' 
                                  ? 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/20 dark:hover:bg-purple-500/30 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-500/40 focus:ring-purple-400' 
                                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-700/60 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 focus:ring-slate-400'">
                          <option value="user" class="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium normal-case">
                            User (Standard)
                          </option>
                          <option value="admin" class="bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 font-bold normal-case">
                            👑 Admin (100% Free All Templates)
                          </option>
                        </select>
                        <lucide-icon [img]="u.role === 'admin' ? ShieldCheck : Shield" 
                                     class="w-3.5 h-3.5 absolute left-2 pointer-events-none"
                                     [class.text-purple-600]="u.role === 'admin'"
                                     [class.dark:text-purple-400]="u.role === 'admin'"
                                     [class.text-slate-400]="u.role !== 'admin'" />
                        <lucide-icon [img]="ChevronDown" 
                                     class="w-3.5 h-3.5 absolute right-2 pointer-events-none text-slate-400" />
                      </div>
                      @if (u.role === 'admin') {
                        <div class="flex items-center gap-1 mt-1 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                          <lucide-icon [img]="Sparkles" class="w-3 h-3 text-amber-500 shrink-0" />
                          <span>Free all templates & no charge</span>
                        </div>
                      }
                    </td>

                    <!-- Portfolio Column -->
                    <td class="px-6 py-4">
                      <button type="button" (click)="viewDrafts(u)" title="Inspect user drafts"
                              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
                        <lucide-icon [img]="FileText" class="w-3.5 h-3.5 text-blue-500" />
                        <span>{{ u.cv_count || 0 }} saved CVs</span>
                        <lucide-icon [img]="ChevronRight" class="w-3 h-3 text-blue-400" />
                      </button>
                    </td>

                    <!-- Account Access (iOS Style Toggle Switch) -->
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <button type="button" (click)="toggleActive(u)"
                                [title]="isUserActive(u) ? 'Click to deactivate access' : 'Click to activate access'"
                                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:opacity-90 active:scale-95"
                                [ngClass]="isUserActive(u) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'">
                          <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out"
                                [ngClass]="isUserActive(u) ? 'translate-x-5' : 'translate-x-0'"></span>
                        </button>
                        <span class="text-xs font-bold"
                              [ngClass]="isUserActive(u) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'">
                          {{ isUserActive(u) ? 'Active' : 'Disabled' }}
                        </span>
                      </div>
                    </td>

                    <!-- Last Active Column -->
                    <td class="px-6 py-4">
                      <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <lucide-icon [img]="Clock" class="w-3.5 h-3.5 text-slate-400" />
                        <span>{{ formatLastLogin(u.last_login_at) }}</span>
                      </div>
                    </td>

                    <!-- Actions Column -->
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center gap-2 justify-end">
                        <!-- View Saved Drafts Button -->
                        <button type="button" (click)="viewDrafts(u)" title="Open User CV Drafts"
                                class="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm">
                          <lucide-icon [img]="FolderOpen" class="w-4 h-4" />
                        </button>

                        <!-- Remove User Button (Regular users only) -->
                        @if (u.role !== 'admin') {
                          <button type="button" (click)="confirmRemove(u)" title="Remove user account"
                                  class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/20 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
                            <lucide-icon [img]="Trash2" class="w-4 h-4" />
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Table Footer Summary -->
        <div class="p-4 px-6 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>
            Showing <strong class="text-slate-800 dark:text-white">{{ filteredUsers().length }}</strong> of <strong class="text-slate-800 dark:text-white">{{ total() }}</strong> platform accounts
          </p>
          <p class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Real-time database sync</span>
          </p>
        </div>
      </div>

      <!-- Modern Modal: Remove User Confirmation -->
      @if (alertUser(); as u) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 transition-all"
             (click)="alertUser.set(null)">
          <div class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden animate-modal-pop"
               (click)="$event.stopPropagation()">
            <!-- Modal Header with Warning Icon -->
            <div class="p-6 text-center space-y-3">
              <div class="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-inner">
                <lucide-icon [img]="AlertCircle" class="w-7 h-7" />
              </div>
              <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">Remove User Account</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to permanently delete the account for <strong class="text-slate-800 dark:text-white">{{ u.full_name }}</strong> ({{ u.email }})?
              </p>
              <div class="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 text-left">
                ⚠️ All associated CV templates, drafts, and uploaded assets linked to this user will be removed. This action cannot be reversed.
              </div>
            </div>

            <!-- Modal Action Buttons -->
            <div class="p-6 pt-0 flex items-center gap-3">
              <button type="button" (click)="alertUser.set(null)"
                      class="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all duration-200 cursor-pointer">
                Cancel
              </button>
              <button type="button" (click)="removeUser(u)"
                      class="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-rose-600/25 transition-all duration-200 cursor-pointer">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modern Modal: Add New User -->
      @if (showAddUser()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 transition-all"
             (click)="showAddUser.set(false)">
          <div class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden animate-modal-pop"
               (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <lucide-icon [img]="UserPlus" class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white">Create New User</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Add an authorized platform user</p>
                </div>
              </div>
              <button type="button" (click)="showAddUser.set(false)"
                      class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <lucide-icon [img]="X" class="w-4 h-4" />
              </button>
            </div>

            <!-- Form Fields -->
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Full Name</label>
                <input [(ngModel)]="newUser.fullName" placeholder="e.g. Sokhim Phorn"
                       class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200" />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Email Address</label>
                <input [(ngModel)]="newUser.email" type="email" placeholder="e.g. user@cvcreator.com"
                       class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200" />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Password</label>
                <div class="relative">
                  <input [(ngModel)]="newUser.password" [type]="showPassword() ? 'text' : 'password'" placeholder="Minimum 8 characters"
                         class="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200" />
                  <button type="button" (click)="showPassword.set(!showPassword())"
                          class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <lucide-icon [img]="showPassword() ? EyeOff : Eye" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Account Role & Privileges</label>
                <div class="grid grid-cols-2 gap-3">
                  <button type="button" (click)="newUser.role = 'user'"
                          class="p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer"
                          [ngClass]="newUser.role === 'user' ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-500/10 ring-2 ring-indigo-500/30' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'">
                    <div class="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-white mb-1">
                      <lucide-icon [img]="Users" class="w-4 h-4 text-slate-500" />
                      <span>Standard User</span>
                    </div>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Standard account requiring payment per CV export</p>
                  </button>

                  <button type="button" (click)="newUser.role = 'admin'"
                          class="p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer"
                          [ngClass]="newUser.role === 'admin' ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-500/15 ring-2 ring-purple-500/30' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'">
                    <div class="flex items-center gap-2 font-bold text-xs text-purple-700 dark:text-purple-300 mb-1">
                      <lucide-icon [img]="ShieldCheck" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>👑 Admin Free</span>
                    </div>
                    <p class="text-[11px] text-purple-700 dark:text-purple-300 font-semibold leading-tight">100% Free all templates, no charge, full admin access</p>
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Action Buttons -->
            <div class="p-6 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <button type="button" (click)="showAddUser.set(false)"
                      class="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all duration-200 cursor-pointer">
                Cancel
              </button>
              <button type="button" (click)="createUser()" [disabled]="isSubmitting()"
                      class="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 text-white font-bold text-xs md:text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50">
                <span>{{ isSubmitting() ? 'Creating...' : 'Create Account' }}</span>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes modalPop {
      0% {
        opacity: 0;
        transform: scale(0.95) translateY(12px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    .animate-modal-pop {
      animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class AdminCustomersComponent implements OnInit {
  // Lucide Icons
  readonly UserPlus = UserPlus;
  readonly Trash2 = Trash2;
  readonly Search = Search;
  readonly FolderOpen = FolderOpen;
  readonly Users = Users;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly Shield = Shield;
  readonly ShieldCheck = ShieldCheck;
  readonly FileText = FileText;
  readonly RefreshCw = RefreshCw;
  readonly X = X;
  readonly ChevronRight = ChevronRight;
  readonly ChevronDown = ChevronDown;
  readonly Mail = Mail;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Check = Check;
  readonly AlertCircle = AlertCircle;
  readonly ArrowUpDown = ArrowUpDown;
  readonly Sparkles = Sparkles;
  readonly ArrowUpRight = ArrowUpRight;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  users = signal<AdminUser[]>([]);
  total = signal(0);
  search = '';
  activeTab = signal<'all' | 'active' | 'inactive' | 'admins'>('all');
  sortBy = signal<'newest' | 'oldest' | 'cvs' | 'name'>('newest');

  isLoading = signal(false);
  isSubmitting = signal(false);
  alertUser = signal<AdminUser | null>(null);
  showAddUser = signal(false);
  showPassword = signal(false);
  newUser = { fullName: '', email: '', password: '', role: 'user' };

  constructor(private http: HttpClient, private toast: ToastService, private router: Router, public auth: AuthService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.http.get<{ users: AdminUser[]; total: number }>('/api/v1/admin/customers', { params: { search: this.search } })
      .subscribe({
        next: ({ users, total }) => {
          this.users.set(users || []);
          this.total.set(total || 0);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
  }

  isUserActive(user: AdminUser): boolean {
    return user.is_active !== false && (user.is_active as any) !== 0;
  }

  activeCount = computed(() => {
    return this.users().filter(u => this.isUserActive(u)).length;
  });

  inactiveCount = computed(() => {
    return this.users().filter(u => !this.isUserActive(u)).length;
  });

  adminCount = computed(() => {
    return this.users().filter(u => u.role === 'admin').length;
  });

  savedCvCount = computed(() => {
    return this.users().reduce((total, user) => total + Number(user.cv_count || 0), 0);
  });

  activePercentage = computed(() => {
    const tot = this.users().length;
    if (!tot) return 0;
    return Math.round((this.activeCount() / tot) * 100);
  });

  filteredUsers = computed(() => {
    let list = [...this.users()];

    // Tab filter
    const tab = this.activeTab();
    if (tab === 'active') {
      list = list.filter(u => this.isUserActive(u));
    } else if (tab === 'inactive') {
      list = list.filter(u => !this.isUserActive(u));
    } else if (tab === 'admins') {
      list = list.filter(u => u.role === 'admin');
    }

    // Sorting
    const sort = this.sortBy();
    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'oldest') {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sort === 'cvs') {
      list.sort((a, b) => (Number(b.cv_count) || 0) - (Number(a.cv_count) || 0));
    } else if (sort === 'name') {
      list.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
    }

    return list;
  });

  formatLastLogin(dateStr: string | null): string {
    if (!dateStr) return 'Never logged in';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  toggleActive(u: AdminUser) {
    const nextState = !this.isUserActive(u);
    this.http.patch(`/api/v1/admin/customers/${u.id}`, { isActive: nextState }).subscribe({
      next: () => {
        this.toast.success(nextState ? `User "${u.full_name}" activated` : `User "${u.full_name}" deactivated`);
        this.load();
      },
      error: () => this.toast.error('Failed to update user status')
    });
  }

  confirmRemove(u: AdminUser) {
    this.alertUser.set(u);
  }

  removeUser(u: AdminUser) {
    this.http.delete(`/api/v1/admin/customers/${u.id}`).subscribe({
      next: () => {
        this.alertUser.set(null);
        this.toast.success(`User "${u.full_name}" has been removed`);
        this.load();
      },
      error: (err) => {
        this.alertUser.set(null);
        this.toast.error(err.error?.message || 'Failed to remove user');
      }
    });
  }

  isCurrentUser(user: AdminUser): boolean {
    const me = this.auth.currentUser();
    return !!me && String(me.id) === String(user.id);
  }

  onRoleChange(user: AdminUser, event: Event) {
    const selectEl = event.target as HTMLSelectElement;
    const newRole = selectEl.value;
    if (newRole === user.role) return;

    if (this.isCurrentUser(user)) {
      this.toast.error('You cannot change your own admin role.');
      selectEl.value = user.role;
      return;
    }

    const prevRole = user.role;
    user.role = newRole;

    this.http.patch<{ user: AdminUser }>(`/api/v1/admin/customers/${user.id}`, { role: newRole }).subscribe({
      next: () => {
        if (newRole === 'admin') {
          this.toast.success(`"${user.full_name}" is now an Admin with 100% free access to all templates!`);
        } else {
          this.toast.success(`"${user.full_name}" role updated to standard User.`);
        }
        this.load();
      },
      error: (err) => {
        user.role = prevRole;
        selectEl.value = prevRole;
        this.toast.error(err.error?.message || 'Failed to update user role');
      }
    });
  }

  viewDrafts(u: AdminUser) {
    this.router.navigate(['/admin/drafts'], { queryParams: { user: u.id } });
  }

  createUser() {
    if (!this.newUser.fullName.trim() || !this.newUser.email.trim() || !this.newUser.password.trim()) {
      this.toast.error('Please fill in all fields');
      return;
    }
    if (this.newUser.password.length < 8) {
      this.toast.error('Password must be at least 8 characters');
      return;
    }

    this.isSubmitting.set(true);
    this.http.post('/api/v1/admin/settings/users', this.newUser).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showAddUser.set(false);
        this.newUser = { fullName: '', email: '', password: '', role: 'user' };
        this.toast.success('New user account created successfully!');
        this.load();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error(err.error?.message || 'Failed to create user');
      }
    });
  }
}

