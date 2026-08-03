import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  Star,
  Languages,
  Award,
  FolderKanban,
  Download,
  Save,
  Eye,
  Upload,
  X,
  Trash2,
  Plus,
  Type,
  Bold,
  Minus,
  AlignJustify,
} from 'lucide-angular';
import { ProfessionalCvComponent } from '../../shared/components/professional-cv/professional-cv.component';
import { ModernSplitCvComponent } from '../../shared/components/modern-split-cv/modern-split-cv.component';
import { CleanSidebarCvComponent } from '../../shared/components/clean-sidebar-cv/clean-sidebar-cv.component';
import { ElegantFrameCvComponent } from '../../shared/components/elegant-frame-cv/elegant-frame-cv.component';
import { ClassicDarkCvComponent } from '../../shared/components/classic-dark-cv/classic-dark-cv.component';
import { FormalClassicCvComponent } from '../../shared/components/formal-classic-cv/formal-classic-cv.component';
import { CoverLetterCvComponent } from '../../shared/components/cover-letter-cv/cover-letter-cv.component';
import { ToastService } from '../../shared/components/toast/toast.service';
import {
  DEGREES,
  FIELDS_OF_STUDY,
  FONT_FAMILIES,
  FONT_WEIGHTS,
  INSTITUTIONS,
  JOB_TITLES,
  LANGUAGE_OPTIONS,
  LINE_HEIGHTS,
  LOCATIONS,
  MONTHS,
  SKILL_SUGGESTIONS,
  yearOptions,
} from '../../shared/cv-field-options';

const SKILL_LEVELS = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'] as const;
const LANG_LEVELS = ['Beginner', 'Intermediate', 'Fluent', 'Native'] as const;

@Component({
  selector: 'app-make-cv',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, ProfessionalCvComponent, ModernSplitCvComponent, CleanSidebarCvComponent, ElegantFrameCvComponent, ClassicDarkCvComponent, FormalClassicCvComponent, CoverLetterCvComponent],
  template: `
    <main class="min-h-screen bg-[#f7faff] dark:bg-slate-950 pt-24 pb-28 px-4">
      <div class="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[84px_minmax(0,1fr)] xl:grid-cols-[84px_minmax(0,1fr)_430px] gap-7">
        <aside class="hidden lg:flex flex-col gap-2">
          @for (item of steps; track item.label) {
            <button type="button" (click)="active.set(item.label)" class="step" [class.selected]="active() === item.label">
              <lucide-icon [img]="item.icon" />
              <span>{{ item.label }}</span>
            </button>
          }
        </aside>

        <section class="min-w-0">
          <a class="text-sm text-slate-500" href="/templates">← Back to Templates</a>
          <div class="flex justify-between items-center mt-2 mb-6">
            <h1 class="text-3xl font-bold dark:text-white">Build Your CV</h1>
            <span class="hidden sm:block text-sm font-bold text-emerald-600">Live form · Save Draft stores everything</span>
          </div>

          <form [formGroup]="form" class="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
            @if (active() === 'Personal Information') {
              <div class="flex items-center gap-4 mb-2">
                <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white"><lucide-icon [img]="UserRound" /></span>
                <h2 class="text-2xl font-bold dark:text-white">Personal Information</h2>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)" title="Decrease font size">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)" title="Increase font size">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" title="Font family">
                  @for (f of fontFamilies; track f.value) {
                    <option [value]="f.value">{{ f.label }}</option>
                  }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" title="Weight">
                  @for (w of fontWeights; track w.value) {
                    <option [value]="w.value">{{ w.label }}</option>
                  }
                </select>
              </div>
              <div class="flex items-center gap-4 mb-4">
                <div class="h-20 w-20 rounded-full overflow-hidden bg-slate-100 grid place-items-center border-2 border-sky-900 shrink-0">
                  @if (photoUrl()) {
                    <img [src]="photoUrl()!" class="h-full w-full object-cover" alt="Photo" />
                  } @else {
                    <lucide-icon [img]="UserRound" />
                  }
                </div>
                <label class="upload">
                  <lucide-icon [img]="Upload" /> Choose profile photo
                  <input type="file" accept="image/png,image/jpeg,image/webp" (change)="selectPhoto($event)" hidden />
                </label>
                @if (photoUrl()) {
                  <button type="button" class="text-sm text-red-600 font-medium" (click)="photoUrl.set(null)">Remove</button>
                }
              </div>
              <div class="grid sm:grid-cols-2 gap-5">
                <label>Full name *<input formControlName="fullName" placeholder="Your name" list="name-hints" /></label>
                <label
                  >Job title
                  <input formControlName="jobTitle" placeholder="Select or type…" list="job-titles" />
                </label>
                <label>Email address<input formControlName="email" type="email" placeholder="you@example.com" /></label>
                <label>Phone number<input formControlName="phone" placeholder="+855 12 345 678" /></label>
                <label
                  >Location
                  <input formControlName="location" placeholder="Select or type…" list="locations" />
                </label>
                <label>LinkedIn / GitHub (optional)<input formControlName="linkedin" placeholder="linkedin.com/in/you" /></label>
              </div>
              <label class="block">Professional summary<textarea formControlName="summary" rows="5" placeholder="Write a short professional summary..."></textarea></label>
            }

            @if (active() === 'Education') {
              <div class="flex items-center gap-4">
                <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white"><lucide-icon [img]="GraduationCap" /></span>
                <h2 class="text-2xl font-bold dark:text-white">Education</h2>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div formArrayName="education" class="space-y-4">
                @for (ed of education.controls; track $index; let i = $index) {
                  <div [formGroupName]="i" class="card-block">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="font-bold text-lg">Education {{ i + 1 }}</h3>
                      <button type="button" class="text-red-600 p-1" (click)="removeEducation(i)" [disabled]="education.length <= 1">
                        <lucide-icon [img]="Trash2" class="w-4 h-4" />
                      </button>
                    </div>
                    <div class="grid sm:grid-cols-2 gap-4">
                      <label
                        >Institution / School *
                        <input formControlName="institution" list="institutions" placeholder="Select or type…" />
                      </label>
                      <label
                        >Degree *
                        <select formControlName="degree">
                          <option value="">Select degree…</option>
                          @for (d of degrees; track d) {
                            <option [value]="d">{{ d }}</option>
                          }
                        </select>
                      </label>
                    </div>
                    <label class="block mt-3"
                      >Field of Study
                      <select formControlName="field">
                        <option value="">Optional — select field…</option>
                        @for (f of fields; track f) {
                          <option [value]="f">{{ f }}</option>
                        }
                      </select>
                    </label>
                    <div class="grid sm:grid-cols-2 gap-4 mt-3">
                      <label
                        >Start Year *
                        <select formControlName="startYear">
                          <option value="">Year…</option>
                          @for (y of years; track y) {
                            <option [value]="y">{{ y }}</option>
                          }
                        </select>
                      </label>
                      <label
                        >End Year
                        <select formControlName="endYear" [disabled]="ed.get('current')?.value">
                          <option value="">Year…</option>
                          @for (y of years; track y) {
                            <option [value]="y">{{ y }}</option>
                          }
                        </select>
                      </label>
                    </div>
                    <label class="check mt-3">
                      <input type="checkbox" formControlName="current" (change)="onCurrentEdu(i)" /> Currently studying here
                    </label>
                    <label class="block mt-3">GPA (Optional)<input formControlName="gpa" placeholder="3.5 / 4.0" /></label>
                    <label class="block mt-3"
                      >Description (Optional)<textarea formControlName="description" rows="3" placeholder="Coursework, honors…"></textarea
                    ></label>
                  </div>
                }
              </div>
              <button type="button" class="add-dashed" (click)="addEducation()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Education</button>
            }

            @if (active() === 'Work Experience') {
              <div class="flex items-center gap-4">
                <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white"><lucide-icon [img]="BriefcaseBusiness" /></span>
                <h2 class="text-2xl font-bold dark:text-white">Work Experience</h2>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div formArrayName="experience" class="space-y-4">
                @for (job of experience.controls; track $index; let i = $index) {
                  <div [formGroupName]="i" class="card-block">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="font-bold text-lg">Work Experience {{ i + 1 }}</h3>
                      <button type="button" class="text-red-600 p-1" (click)="removeExperience(i)" [disabled]="experience.length <= 1">
                        <lucide-icon [img]="Trash2" class="w-4 h-4" />
                      </button>
                    </div>
                    <div class="grid sm:grid-cols-2 gap-4">
                      <label>Company Name *<input formControlName="company" placeholder="Company name" list="companies" /></label>
                      <label
                        >Job Title / Position *
                        <input formControlName="position" list="job-titles" placeholder="Select or type…" />
                      </label>
                    </div>
                    <div class="grid sm:grid-cols-2 gap-4 mt-3">
                      <label
                        >Start Date *
                        <div class="date-row">
                          <select formControlName="startMonth">
                            <option value="">Month</option>
                            @for (m of months; track m) {
                              <option [value]="m">{{ m }}</option>
                            }
                          </select>
                          <select formControlName="startYear">
                            <option value="">Year</option>
                            @for (y of years; track y) {
                              <option [value]="y">{{ y }}</option>
                            }
                          </select>
                        </div>
                      </label>
                      <label
                        >End Date
                        <div class="date-row">
                          <select formControlName="endMonth" [disabled]="job.get('current')?.value">
                            <option value="">Month</option>
                            @for (m of months; track m) {
                              <option [value]="m">{{ m }}</option>
                            }
                          </select>
                          <select formControlName="endYear" [disabled]="job.get('current')?.value">
                            <option value="">Year</option>
                            @for (y of years; track y) {
                              <option [value]="y">{{ y }}</option>
                            }
                          </select>
                        </div>
                      </label>
                    </div>
                    <label class="check mt-3">
                      <input type="checkbox" formControlName="current" (change)="onCurrentJob(i)" /> Currently working here
                    </label>
                    <div class="mt-3" formArrayName="responsibilities">
                      <span class="font-semibold text-sm text-slate-700">Responsibilities & Achievements</span>
                      @for (r of responsibilities(i).controls; track $index; let ri = $index) {
                        <div class="flex gap-2 mt-2">
                          <textarea [formControlName]="ri" rows="2" class="flex-1" placeholder="Describe a responsibility…"></textarea>
                          <button type="button" class="text-red-500 shrink-0" (click)="removeResponsibility(i, ri)" [disabled]="responsibilities(i).length <= 1">
                            <lucide-icon [img]="Trash2" class="w-4 h-4" />
                          </button>
                        </div>
                      }
                      <button type="button" class="text-sky-800 font-semibold text-sm mt-2" (click)="addResponsibility(i)">+ Add line / responsibility</button>
                    </div>
                  </div>
                }
              </div>
              <button type="button" class="add-dashed" (click)="addExperience()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Work Experience</button>
            }

            @if (active() === 'Skills') {
              <div class="flex items-center gap-4">
                <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white"><lucide-icon [img]="Star" /></span>
                <h2 class="text-2xl font-bold dark:text-white">Skills <span class="opt">Optional</span></h2>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div class="card-block">
                <div class="grid sm:grid-cols-2 gap-4 items-start">
                  <label
                    >Skill Name
                    <input [(ngModel)]="skillDraft.name" [ngModelOptions]="{ standalone: true }" list="skills-list" placeholder="Select or type…" />
                  </label>
                  <div>
                    <span class="font-semibold text-sm text-slate-700">Skill Level</span>
                    <div class="flex flex-wrap gap-2 mt-2">
                      @for (lv of skillLevels; track lv) {
                        <button type="button" class="chip" [class.on]="skillDraft.level === lv" (click)="skillDraft.level = lv">{{ lv }}</button>
                      }
                    </div>
                  </div>
                </div>
                <button type="button" class="add-solid mt-4" (click)="addSkill()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Skill</button>
              </div>
              <div formArrayName="skills" class="space-y-3">
                @for (s of skills.controls; track $index; let i = $index) {
                  <div [formGroupName]="i" class="card-block flex justify-between items-center">
                    <div>
                      <p class="font-bold">{{ s.value.name }}</p>
                      <p class="text-sm text-slate-500">{{ s.value.level }}</p>
                    </div>
                    <button type="button" class="text-red-600" (click)="removeSkill(i)"><lucide-icon [img]="Trash2" class="w-4 h-4" /></button>
                  </div>
                }
              </div>
            }

            @if (active() === 'Languages') {
              <div class="flex items-center gap-4">
                <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white"><lucide-icon [img]="Languages" /></span>
                <h2 class="text-2xl font-bold dark:text-white">Languages <span class="opt">Optional</span></h2>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div class="card-block">
                <div class="grid sm:grid-cols-2 gap-4 items-start">
                  <label
                    >Language
                    <select [(ngModel)]="langDraft.name" [ngModelOptions]="{ standalone: true }">
                      <option value="">Select language…</option>
                      @for (l of languageOptions; track l) {
                        <option [value]="l">{{ l }}</option>
                      }
                    </select>
                  </label>
                  <div>
                    <span class="font-semibold text-sm text-slate-700">Proficiency</span>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                      @for (lv of langLevels; track lv) {
                        <button type="button" class="chip" [class.on]="langDraft.proficiency === lv" (click)="langDraft.proficiency = lv">{{ lv }}</button>
                      }
                    </div>
                  </div>
                </div>
                <button type="button" class="add-solid mt-4" (click)="addLanguage()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Language</button>
              </div>
              <div formArrayName="languages" class="space-y-3">
                @for (l of languages.controls; track $index; let i = $index) {
                  <div [formGroupName]="i" class="card-block">
                    <div class="flex justify-between items-center mb-3">
                      <p class="font-bold">{{ l.value.name }}</p>
                      <button type="button" class="text-red-600" (click)="removeLanguage(i)"><lucide-icon [img]="Trash2" class="w-4 h-4" /></button>
                    </div>
                    <div class="grid gap-2">
                      @for (lv of langLevels; track lv) {
                        <button type="button" class="level-bar" [class.on]="l.value.proficiency === lv" (click)="l.patchValue({ proficiency: lv })">{{ lv }}</button>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            @if (active() === 'Certifications') {
              <div class="flex items-center gap-4">
                <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white"><lucide-icon [img]="Award" /></span>
                <h2 class="text-2xl font-bold dark:text-white">Certifications <span class="opt">Optional</span></h2>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div formArrayName="certifications" class="space-y-4">
                @for (c of certifications.controls; track $index; let i = $index) {
                  <div [formGroupName]="i" class="card-block">
                    <div class="flex justify-between mb-3">
                      <h3 class="font-bold">Certification {{ i + 1 }}</h3>
                      <button type="button" class="text-red-600" (click)="removeCertification(i)"><lucide-icon [img]="Trash2" class="w-4 h-4" /></button>
                    </div>
                    <label>Name *<input formControlName="name" placeholder="AWS Certified Solutions Architect" list="certs" /></label>
                    <label class="block mt-3">Issuer<input formControlName="issuer" placeholder="Amazon Web Services" /></label>
                    <label class="block mt-3">Date<input formControlName="date" placeholder="May 2023" list="months-years" /></label>
                  </div>
                }
              </div>
              <button type="button" class="add-dashed" (click)="addCertification()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Certification</button>
            }

            @if (active() === 'Projects') {
              <div class="flex items-center gap-4">
                <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white"><lucide-icon [img]="FolderKanban" /></span>
                <h2 class="text-2xl font-bold dark:text-white">Projects <span class="opt">Optional</span></h2>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div formArrayName="projects" class="space-y-4">
                @for (p of projects.controls; track $index; let i = $index) {
                  <div [formGroupName]="i" class="card-block">
                    <div class="flex justify-between mb-3">
                      <h3 class="font-bold">Project {{ i + 1 }}</h3>
                      <button type="button" class="text-red-600" (click)="removeProject(i)" [disabled]="projects.length <= 1">
                        <lucide-icon [img]="Trash2" class="w-4 h-4" />
                      </button>
                    </div>
                    <label>Project Name *<input formControlName="name" placeholder="System HelpDesk" /></label>
                    <label class="block mt-3">Description *<textarea formControlName="description" rows="3" placeholder="Tech stack…"></textarea></label>
                    <label class="block mt-3">Project Link (Optional)<input formControlName="link" placeholder="https://..." /></label>
                  </div>
                }
              </div>
              <button type="button" class="add-dashed" (click)="addProject()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Project</button>
            }

            @if (active() === 'References') {
              <div class="flex items-center gap-4">
                <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white"><lucide-icon [img]="UserRound" /></span>
                <h2 class="text-2xl font-bold dark:text-white">References <span class="opt">Optional</span></h2>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div formArrayName="references" class="space-y-4">
                @for (r of references.controls; track $index; let i = $index) {
                  <div [formGroupName]="i" class="card-block">
                    <div class="flex justify-between mb-3">
                      <h3 class="font-bold">Reference {{ i + 1 }}</h3>
                      <button type="button" class="text-red-600" (click)="removeReference(i)"><lucide-icon [img]="Trash2" class="w-4 h-4" /></button>
                    </div>
                    <div class="grid sm:grid-cols-2 gap-4">
                      <label>Full Name *<input formControlName="name" placeholder="Reference Full Name" /></label>
                      <label>Position<input formControlName="position" placeholder="Job position" /></label>
                    </div>
                    <label class="block mt-3">Company<input formControlName="company" placeholder="Company name" /></label>
                    <div class="grid sm:grid-cols-2 gap-4 mt-3">
                      <label>Phone<input formControlName="phone" placeholder="00 123 456 789" /></label>
                      <label>Email<input formControlName="email" type="email" placeholder="ref@example.com" /></label>
                    </div>
                  </div>
                }
              </div>
              <button type="button" class="add-dashed" (click)="addReference()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Reference</button>
            }

            @if (active() === 'Hobbies') {
              <div class="flex items-center gap-4">
                <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white"><lucide-icon [img]="Star" /></span>
                <h2 class="text-2xl font-bold dark:text-white">Hobbies <span class="opt">Optional</span></h2>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div class="card-block">
                <label>Hobby Name
                  <input [(ngModel)]="hobbyDraft" [ngModelOptions]="{ standalone: true }" placeholder="e.g. Music, Travel, Reading…" />
                </label>
                <button type="button" class="add-solid mt-4" (click)="addHobby()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Hobby</button>
              </div>
              <div formArrayName="hobbies" class="space-y-3">
                @for (h of hobbies.controls; track $index; let i = $index) {
                  <div [formGroupName]="i" class="card-block flex justify-between items-center">
                    <p class="font-bold">{{ h.value.name }}</p>
                    <button type="button" class="text-red-600" (click)="removeHobby(i)"><lucide-icon [img]="Trash2" class="w-4 h-4" /></button>
                  </div>
                }
              </div>
            }
          </form>

          <!-- Datalists for selectable suggestions -->
          <datalist id="job-titles">
            @for (j of jobTitles; track j) {
              <option [value]="j"></option>
            }
          </datalist>
          <datalist id="locations">
            @for (l of locations; track l) {
              <option [value]="l"></option>
            }
          </datalist>
          <datalist id="institutions">
            @for (i of institutions; track i) {
              <option [value]="i"></option>
            }
          </datalist>
          <datalist id="skills-list">
            @for (s of skillSuggestions; track s) {
              <option [value]="s"></option>
            }
          </datalist>
          <datalist id="companies">
            <option value="HYUNDAI PACKAGING"></option>
            <option value="Bestway international"></option>
            <option value="ACLED A Bank"></option>
            <option value="Cellcard"></option>
          </datalist>
          <datalist id="certs">
            <option value="AWS Certified Solutions Architect"></option>
            <option value="Professional Scrum Master (PSM I)"></option>
            <option value="Google IT Support"></option>
            <option value="IELTS"></option>
            <option value="TOEFL"></option>
          </datalist>
        </section>

        <!-- Live preview + typography -->
        <aside class="xl:col-start-3 xl:row-start-1 xl:w-[430px]">
          <div class="sticky top-24 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
            <div class="flex items-center justify-between font-bold dark:text-white">
              <span class="text-emerald-600 text-sm">● LIVE PREVIEW</span>
              <div class="flex gap-1.5">
                <button type="button" class="outline sm" (click)="zoomOut()">−</button>
                <span class="self-center text-xs w-8 text-center">{{ (zoom() * 100).toFixed(0) }}%</span>
                <button type="button" class="outline sm" (click)="zoomIn()">+</button>
                <button type="button" class="outline sm" (click)="fullPreview.set(true)" title="Full screen">
                  <lucide-icon [img]="Eye" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Professional typography toolbar -->
            <div class="typo-bar" title="Typography — applies to your CV">
              <div class="typo-group">
                <lucide-icon [img]="Type" class="w-3.5 h-3.5 text-slate-400" />
                <button type="button" class="typo-btn" (click)="bumpFont(-1)" title="Decrease font size">A−</button>
                <span class="typo-val">{{ fontSize() }}px</span>
                <button type="button" class="typo-btn" (click)="bumpFont(1)" title="Increase font size">A+</button>
              </div>
              <div class="typo-group">
                <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><text x="3" y="18" font-size="16" font-weight="400" stroke="none" fill="#94a3b8">F</text></svg>
                <select class="typo-select font-sel" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" title="Font family">
                  @for (f of fontFamilies; track f.value) {
                    <option [value]="f.value" [style.font-family]="f.value">{{ f.label }}</option>
                  }
                </select>
              </div>
              <div class="typo-group">
                <lucide-icon [img]="Bold" class="w-3.5 h-3.5 text-slate-400" />
                <select class="typo-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" title="Font weight">
                  @for (w of fontWeights; track w.value) {
                    <option [value]="w.value">{{ w.label }}</option>
                  }
                </select>
              </div>
              <div class="typo-group">
                <lucide-icon [img]="AlignJustify" class="w-3.5 h-3.5 text-slate-400" />
                <select class="typo-select" [ngModel]="lineHeight()" (ngModelChange)="lineHeight.set(+$event)" title="Line spacing">
                  @for (lh of lineHeights; track lh.value) {
                    <option [value]="lh.value">{{ lh.label }}</option>
                  }
                </select>
              </div>
              <button
                type="button"
                class="typo-btn line-toggle"
                [class.on]="sectionLines()"
                (click)="sectionLines.set(!sectionLines())"
                title="Section lines / timeline"
              >
                <lucide-icon [img]="Minus" class="w-3.5 h-3.5" />
                Lines
              </button>
            </div>

            <div class="h-[520px] overflow-auto rounded-xl border-2 border-slate-900 bg-slate-100">
              <div [style.zoom]="zoom() * 0.48" class="origin-top-left">
                <ng-container *ngTemplateOutlet="cvPreview"></ng-container>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer class="fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-4xl mx-auto flex justify-end gap-3 p-3">
          <button type="button" class="outline" (click)="save()"><lucide-icon [img]="Save" /> Save Draft</button>
          <button type="button" class="download" (click)="showDownloadModal.set(true)"><lucide-icon [img]="Download" /> Download CV</button>
        </div>
      </footer>

      <!-- Download Format Modal -->
      @if (showDownloadModal()) {
        <div class="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
             (click)="showDownloadModal.set(false)">
          <div class="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden animate-[slideUp_0.25s_ease-out]"
               (click)="$event.stopPropagation()">
            <div class="px-6 pt-6 pb-3 text-center">
              <p class="font-semibold text-slate-800 dark:text-white text-lg">Download CV</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose your preferred format</p>
            </div>
            <div class="px-6 pb-4 grid grid-cols-2 gap-3">
              <button type="button" (click)="downloadAs('pdf')"
                      class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                      [class.border-slate-200]="true" [class.dark:border-slate-700]="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6"/><path d="M9 11h6"/></svg>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">PDF</span>
                <span class="text-[10px] text-slate-400">Best for sharing</span>
              </button>
              <button type="button" (click)="downloadAs('docx')"
                      class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                      [class.border-slate-200]="true" [class.dark:border-slate-700]="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">DOCX</span>
                <span class="text-[10px] text-slate-400">Editable in Word</span>
              </button>
            </div>
            <div class="border-t border-slate-200 dark:border-slate-700">
              <button type="button" (click)="showDownloadModal.set(false)"
                      class="w-full py-3 text-slate-500 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      }
    </main>

    @if (fullPreview()) {
      <div class="fixed inset-0 z-[100] bg-slate-950/80 p-4 overflow-auto print-overlay">
        <div class="no-print fixed right-6 top-5 z-10 flex gap-2">
          <div class="typo-bar bg-white shadow-lg rounded-xl px-3 py-2">
            <button type="button" class="typo-btn" (click)="bumpFont(-1)">A−</button>
            <span class="typo-val">{{ fontSize() }}px</span>
            <button type="button" class="typo-btn" (click)="bumpFont(1)">A+</button>
            <select class="typo-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)">
              @for (w of fontWeights; track w.value) {
                <option [value]="w.value">{{ w.label }}</option>
              }
            </select>
            <button type="button" class="typo-btn line-toggle" [class.on]="sectionLines()" (click)="sectionLines.set(!sectionLines())">Lines</button>
          </div>
          <button type="button" class="rounded-full bg-white p-3 shadow" (click)="fullPreview.set(false)">
            <lucide-icon [img]="X" />
          </button>
        </div>
        <div class="mx-auto mt-16 print-root a4-sheet">
          <ng-container *ngTemplateOutlet="cvPreview"></ng-container>
        </div>
      </div>
    }

    <ng-template #cvPreview>
      @if (layout() === 'modern-split') {
        <app-modern-split-cv
          [photoUrl]="photoUrl()"
          [name]="form.value.fullName || 'Your Name'"
          [jobTitle]="form.value.jobTitle || ''"
          [email]="form.value.email || ''"
          [phone]="form.value.phone || ''"
          [location]="form.value.location || ''"
          [summary]="form.value.summary || defaultSummary"
          [education]="form.value.education || []"
          [experience]="mappedExperience()"
          [skills]="form.value.skills || []"
          [languages]="form.value.languages || []"
          [references]="form.value.references || []"
          [hobbies]="form.value.hobbies || []"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
          [accent]="accentColor()"
        />
      } @else if (layout() === 'clean-sidebar') {
        <app-clean-sidebar-cv
          [photoUrl]="photoUrl()"
          [name]="form.value.fullName || 'Your Name'"
          [jobTitle]="form.value.jobTitle || ''"
          [email]="form.value.email || ''"
          [phone]="form.value.phone || ''"
          [location]="form.value.location || ''"
          [summary]="form.value.summary || defaultSummary"
          [education]="form.value.education || []"
          [experience]="mappedExperience()"
          [skills]="form.value.skills || []"
          [languages]="form.value.languages || []"
          [references]="form.value.references || []"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
          [accent]="accentColor()"
        />
      } @else if (layout() === 'elegant-frame') {
        <app-elegant-frame-cv
          [photoUrl]="photoUrl()"
          [name]="form.value.fullName || 'Your Name'"
          [jobTitle]="form.value.jobTitle || ''"
          [email]="form.value.email || ''"
          [phone]="form.value.phone || ''"
          [location]="form.value.location || ''"
          [linkedin]="form.value.linkedin || ''"
          [summary]="form.value.summary || defaultSummary"
          [education]="form.value.education || []"
          [experience]="mappedExperience()"
          [skills]="form.value.skills || []"
          [languages]="form.value.languages || []"
          [references]="form.value.references || []"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
          [accent]="accentColor()"
        />
      } @else if (layout() === 'classic-dark') {
        <app-classic-dark-cv
          [photoUrl]="photoUrl()"
          [name]="form.value.fullName || 'Your Name'"
          [jobTitle]="form.value.jobTitle || ''"
          [email]="form.value.email || ''"
          [phone]="form.value.phone || ''"
          [location]="form.value.location || ''"
          [linkedin]="form.value.linkedin || ''"
          [summary]="form.value.summary || defaultSummary"
          [education]="form.value.education || []"
          [experience]="mappedExperience()"
          [skills]="form.value.skills || []"
          [languages]="form.value.languages || []"
          [references]="form.value.references || []"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
          [accent]="accentColor()"
        />
      } @else if (layout() === 'formal-classic') {
        <app-formal-classic-cv
          [photoUrl]="photoUrl()"
          [name]="form.value.fullName || 'Your Name'"
          [jobTitle]="form.value.jobTitle || ''"
          [email]="form.value.email || ''"
          [phone]="form.value.phone || ''"
          [location]="form.value.location || ''"
          [linkedin]="form.value.linkedin || ''"
          [summary]="form.value.summary || defaultSummary"
          [education]="form.value.education || []"
          [experience]="mappedExperience()"
          [skills]="form.value.skills || []"
          [languages]="form.value.languages || []"
          [references]="form.value.references || []"
          [projects]="form.value.projects || []"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
        />
      } @else if (layout() === 'cover-letter') {
        <app-cover-letter-cv
          [accent]="accentColor()"
          [name]="form.value.fullName || 'Your Name'"
          [phone]="form.value.phone || ''"
          [email]="form.value.email || ''"
          [location]="form.value.location || ''"
          [bodyText]="form.value.summary || ''"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
        />
      } @else {
        <app-professional-cv
          [photoUrl]="photoUrl()"
          [name]="form.value.fullName || 'Your Name'"
          [jobTitle]="form.value.jobTitle || ''"
          [email]="form.value.email || ''"
          [phone]="form.value.phone || ''"
          [location]="form.value.location || ''"
          [linkedin]="form.value.linkedin || ''"
          [summary]="form.value.summary || defaultSummary"
          [education]="form.value.education || []"
          [experience]="mappedExperience()"
          [skills]="form.value.skills || []"
          [languages]="form.value.languages || []"
          [certifications]="form.value.certifications || []"
          [projects]="form.value.projects || []"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
          [sectionLines]="sectionLines()"
          [accent]="accentColor()"
        />
      }
    </ng-template>
  `,
  styles: [
    `
      label {
        font-weight: 650;
        font-size: 0.9rem;
        color: #1f2937;
        display: block;
      }
      input,
      textarea,
      select {
        display: block;
        width: 100%;
        margin-top: 0.45rem;
        padding: 0.85rem 1rem;
        border: 1px solid #b9c4d4;
        border-radius: 0.9rem;
        background: #f8fafc;
        font: inherit;
        outline: none;
        appearance: auto;
      }
      select {
        cursor: pointer;
      }
      input:focus,
      textarea:focus,
      select:focus {
        border-color: #0284c7;
        box-shadow: 0 0 0 3px #bae6fd;
      }
      .date-row {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 0.5rem;
        margin-top: 0.45rem;
      }
      .date-row select {
        margin-top: 0;
      }
      .upload {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: #062b50;
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        cursor: pointer;
      }
      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
        padding: 0.7rem 0.3rem;
        border-radius: 1rem;
        border: 1px solid #dce4ef;
        background: white;
        color: #60718b;
        font-size: 0.65rem;
        text-align: center;
      }
      .step.selected {
        background: #062b50;
        color: #fff;
      }
      .download,
      .outline {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.75rem 1.05rem;
        border-radius: 0.8rem;
        font-weight: 700;
      }
      .outline.sm {
        padding: 0.35rem 0.55rem;
        font-size: 0.75rem;
      }
      .download {
        background: #16a34a;
        color: white;
        box-shadow: 0 6px 14px #16a34a44;
      }
      .outline {
        border: 1px solid #062b50;
        color: #062b50;
        background: white;
      }
      .card-block {
        border: 1px solid #e2e8f0;
        border-left: 4px solid #062b50;
        border-radius: 1rem;
        background: #f8fafc;
        padding: 1.25rem;
      }
      .add-dashed {
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        padding: 0.9rem;
        border-radius: 1rem;
        border: 2px dashed #cbd5e1;
        color: #64748b;
        font-weight: 600;
        background: transparent;
      }
      .add-solid {
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        padding: 0.85rem;
        border-radius: 0.9rem;
        background: #6b7c93;
        color: white;
        font-weight: 700;
      }
      .chip {
        border: 1px solid #cbd5e1;
        border-radius: 999px;
        padding: 0.35rem 0.85rem;
        font-size: 0.85rem;
        background: white;
        color: #334155;
      }
      .chip.on {
        background: #062b50;
        color: white;
        border-color: #062b50;
      }
      .level-bar {
        width: 100%;
        padding: 0.55rem;
        border-radius: 0.6rem;
        border: 1px solid #e2e8f0;
        background: white;
        color: #64748b;
        font-weight: 600;
      }
      .level-bar.on {
        background: #062b50;
        color: white;
        border-color: #062b50;
      }
      .check {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        font-size: 0.9rem;
      }
      .check input {
        width: auto;
        margin: 0;
      }
      .opt {
        font-size: 0.7rem;
        font-weight: 600;
        background: #e2e8f0;
        color: #64748b;
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
        margin-left: 0.35rem;
      }
      .a4-sheet {
        width: 210mm;
        max-width: 100%;
      }
      .typo-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.45rem;
        padding: 0.5rem 0.6rem;
        border-radius: 0.75rem;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
      }
      .typo-group {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
      .typo-btn {
        border: 1px solid #cbd5e1;
        background: #fff;
        border-radius: 0.45rem;
        padding: 0.25rem 0.45rem;
        font-size: 0.75rem;
        font-weight: 700;
        color: #334155;
        display: inline-flex;
        align-items: center;
        gap: 0.2rem;
      }
      .typo-btn:hover {
        border-color: #062b50;
        color: #062b50;
      }
      .typo-btn.on {
        background: #062b50;
        color: #fff;
        border-color: #062b50;
      }
      .typo-val {
        font-size: 0.7rem;
        font-weight: 700;
        color: #64748b;
        min-width: 2rem;
        text-align: center;
      }
      .typo-select {
        margin: 0;
        padding: 0.25rem 0.4rem;
        font-size: 0.7rem;
        border-radius: 0.45rem;
        border: 1px solid #cbd5e1;
        background: #fff;
        width: auto;
        min-width: 0;
      }

      /* ── Per-section font toolbar ── */
      .font-toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.35rem;
        padding: 0.55rem 0.9rem;
        margin-bottom: 0.5rem;
        background: #f0f4f9;
        border: 1px solid #dde4ee;
        border-radius: 0.9rem;
      }
      .ft-btn {
        border: 1px solid #c8d4e0;
        background: #fff;
        border-radius: 0.4rem;
        padding: 0.22rem 0.55rem;
        font-size: 0.78rem;
        font-weight: 800;
        color: #334155;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
      }
      .ft-btn:hover { background: #062b50; color: #fff; border-color: #062b50; }
      .ft-val {
        font-size: 0.72rem;
        font-weight: 700;
        color: #475569;
        min-width: 2.2rem;
        text-align: center;
        background: #fff;
        border: 1px solid #c8d4e0;
        border-radius: 0.4rem;
        padding: 0.22rem 0.3rem;
      }
      .ft-select {
        padding: 0.22rem 0.4rem;
        font-size: 0.72rem;
        border-radius: 0.4rem;
        border: 1px solid #c8d4e0;
        background: #fff;
        color: #334155;
        cursor: pointer;
        margin: 0;
        width: auto;
      }
      .ft-sep {
        width: 1px;
        height: 20px;
        background: #c8d4e0;
        flex-shrink: 0;
      }
    `,
  ],
})
export class MakeCvComponent implements OnInit, OnDestroy {
  UserRound = UserRound;
  Download = Download;
  Save = Save;
  Eye = Eye;
  Upload = Upload;
  X = X;
  Trash2 = Trash2;
  Plus = Plus;
  Type = Type;
  Bold = Bold;
  Minus = Minus;
  AlignJustify = AlignJustify;
  GraduationCap = GraduationCap;
  BriefcaseBusiness = BriefcaseBusiness;
  Star = Star;
  Languages = Languages;
  Award = Award;
  FolderKanban = FolderKanban;

  jobTitles = JOB_TITLES;
  locations = LOCATIONS;
  institutions = INSTITUTIONS;
  degrees = DEGREES;
  fields = FIELDS_OF_STUDY;
  skillSuggestions = SKILL_SUGGESTIONS;
  languageOptions = LANGUAGE_OPTIONS;
  months = MONTHS;
  years = yearOptions();
  fontWeights = FONT_WEIGHTS;
  lineHeights = LINE_HEIGHTS;
  fontFamilies = FONT_FAMILIES;

  skillLevels = SKILL_LEVELS;
  langLevels = LANG_LEVELS;
  skillDraft = { name: '', level: 'Intermediate' as string };
  langDraft = { name: '', proficiency: 'Intermediate' as string };

  active = signal('Personal Information');
  fullPreview = signal(false);
  photoUrl = signal<string | null>(null);
  zoom = signal(1);
  fontSize = signal(10);
  fontWeight = signal(400);
  lineHeight = signal(1.4);
  fontFamily = signal('Arial, Helvetica, sans-serif');
  sectionLines = signal(true);
  accentColor = signal('#667b97');
  layout = signal<'professional' | 'modern-split' | 'clean-sidebar' | 'elegant-frame' | 'classic-dark' | 'formal-classic' | 'cover-letter'>('professional');
  cvId: string | null = null;
  templateId: string | null = null;
  hobbyDraft = '';

  defaultSummary = 'Goal-oriented, adaptable, and always striving to learn, grow, and deliver the best results.';

  steps = [
    { label: 'Personal Information', icon: UserRound },
    { label: 'Education', icon: GraduationCap },
    { label: 'Work Experience', icon: BriefcaseBusiness },
    { label: 'Skills', icon: Star },
    { label: 'Languages', icon: Languages },
    { label: 'Certifications', icon: Award },
    { label: 'Projects', icon: FolderKanban },
    { label: 'References', icon: UserRound },
    { label: 'Hobbies', icon: Star },
  ];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toast: ToastService,
  ) {
    this.form = this.fb.group({
      fullName: [''],
      jobTitle: [''],
      email: [''],
      phone: [''],
      location: [''],
      linkedin: [''],
      summary: [''],
      education: this.fb.array([this.newEducation()]),
      experience: this.fb.array([this.newExperience()]),
      skills: this.fb.array([]),
      languages: this.fb.array([]),
      certifications: this.fb.array([]),
      projects: this.fb.array([this.newProject()]),
      references: this.fb.array([]),
      hobbies: this.fb.array([]),
    });
    this.cvId = this.route.snapshot.queryParamMap.get('cvId');
    this.templateId = this.route.snapshot.queryParamMap.get('templateId');
    const color = this.route.snapshot.queryParamMap.get('color');
    if (color) this.accentColor.set(color);
    const layoutParam = this.route.snapshot.queryParamMap.get('layout');
    if (layoutParam === 'modern-split') this.layout.set('modern-split');
    else if (layoutParam === 'clean-sidebar') this.layout.set('clean-sidebar');
    else if (layoutParam === 'elegant-frame') this.layout.set('elegant-frame');
    else if (layoutParam === 'classic-dark') this.layout.set('classic-dark');
    else if (layoutParam === 'formal-classic') this.layout.set('formal-classic');
    else if (layoutParam === 'cover-letter') this.layout.set('cover-letter');
  }

  ngOnInit() {
    if (this.cvId) {
      this.http.get<{ cv: any }>(`/api/v1/cvs/${this.cvId}`).subscribe({
        next: ({ cv }) => {
          const content = typeof cv.content === 'string' ? JSON.parse(cv.content || '{}') : cv.content || {};
          this.patchFromContent(content);
          if (cv.selected_color) this.accentColor.set(cv.selected_color);
        },
        error: () => {},
      });
    }
  }

  get education() {
    return this.form.get('education') as FormArray;
  }
  get experience() {
    return this.form.get('experience') as FormArray;
  }
  get skills() {
    return this.form.get('skills') as FormArray;
  }
  get languages() {
    return this.form.get('languages') as FormArray;
  }
  get certifications() {
    return this.form.get('certifications') as FormArray;
  }
  get projects() {
    return this.form.get('projects') as FormArray;
  }
  get references() {
    return this.form.get('references') as FormArray;
  }
  get hobbies() {
    return this.form.get('hobbies') as FormArray;
  }

  responsibilities(jobIndex: number) {
    return this.experience.at(jobIndex).get('responsibilities') as FormArray;
  }

  /** Merge month/year selects into display dates for the CV. */
  mappedExperience() {
    return (this.form.value.experience || []).map((e: any) => ({
      ...e,
      startDate: [e.startMonth, e.startYear].filter(Boolean).join(' ') || e.startDate || '',
      endDate: [e.endMonth, e.endYear].filter(Boolean).join(' ') || e.endDate || '',
    }));
  }

  newEducation() {
    return this.fb.group({
      institution: [''],
      degree: [''],
      field: [''],
      startYear: [''],
      endYear: [''],
      current: [false],
      gpa: [''],
      description: [''],
    });
  }

  newExperience() {
    return this.fb.group({
      company: [''],
      position: [''],
      startMonth: [''],
      startYear: [''],
      endMonth: [''],
      endYear: [''],
      startDate: [''],
      endDate: [''],
      current: [false],
      responsibilities: this.fb.array([this.fb.control('')]),
    });
  }

  newProject() {
    return this.fb.group({ name: [''], description: [''], link: [''] });
  }

  newCertification() {
    return this.fb.group({ name: [''], issuer: [''], date: [''] });
  }

  bumpFont(delta: number) {
    this.fontSize.update((n) => Math.min(16, Math.max(7, n + delta)));
  }

  addEducation() {
    this.education.push(this.newEducation());
  }
  removeEducation(i: number) {
    if (this.education.length > 1) this.education.removeAt(i);
  }
  addExperience() {
    this.experience.push(this.newExperience());
  }
  removeExperience(i: number) {
    if (this.experience.length > 1) this.experience.removeAt(i);
  }
  addResponsibility(jobIndex: number) {
    this.responsibilities(jobIndex).push(this.fb.control(''));
  }
  removeResponsibility(jobIndex: number, ri: number) {
    const arr = this.responsibilities(jobIndex);
    if (arr.length > 1) arr.removeAt(ri);
  }
  addSkill() {
    const name = this.skillDraft.name.trim();
    if (!name) {
      alert('Enter or select a skill name first.');
      return;
    }
    this.skills.push(this.fb.group({ name: [name], level: [this.skillDraft.level] }));
    this.skillDraft = { name: '', level: 'Intermediate' };
  }
  removeSkill(i: number) {
    this.skills.removeAt(i);
  }
  addLanguage() {
    const name = this.langDraft.name.trim();
    if (!name) {
      alert('Select a language first.');
      return;
    }
    this.languages.push(this.fb.group({ name: [name], proficiency: [this.langDraft.proficiency] }));
    this.langDraft = { name: '', proficiency: 'Intermediate' };
  }
  removeLanguage(i: number) {
    this.languages.removeAt(i);
  }
  addCertification() {
    this.certifications.push(this.newCertification());
  }
  removeCertification(i: number) {
    this.certifications.removeAt(i);
  }
  addProject() {
    this.projects.push(this.newProject());
  }
  removeProject(i: number) {
    if (this.projects.length > 1) this.projects.removeAt(i);
  }

  newReference() {
    return this.fb.group({ name: [''], position: [''], company: [''], phone: [''], email: [''] });
  }
  addReference() {
    this.references.push(this.newReference());
  }
  removeReference(i: number) {
    this.references.removeAt(i);
  }

  addHobby() {
    const name = this.hobbyDraft.trim();
    if (!name) return;
    this.hobbies.push(this.fb.group({ name: [name] }));
    this.hobbyDraft = '';
  }
  removeHobby(i: number) {
    this.hobbies.removeAt(i);
  }

  onCurrentEdu(i: number) {
    const g = this.education.at(i);
    if (g.get('current')?.value) g.patchValue({ endYear: '' });
  }
  onCurrentJob(i: number) {
    const g = this.experience.at(i);
    if (g.get('current')?.value) g.patchValue({ endMonth: '', endYear: '', endDate: '' });
  }

  selectPhoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      alert('Please use a photo under 1.5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.photoUrl.set(String(reader.result));
    reader.readAsDataURL(file);
  }

  zoomIn() {
    this.zoom.set(Math.min(1.5, this.zoom() + 0.1));
  }
  zoomOut() {
    this.zoom.set(Math.max(0.5, this.zoom() - 0.1));
  }

  buildContent() {
    const raw = this.form.getRawValue();
    const experience = (raw.experience || [])
      .filter((e: any) => e.company || e.position)
      .map((e: any) => ({
        ...e,
        startDate: [e.startMonth, e.startYear].filter(Boolean).join(' ') || e.startDate || '',
        endDate: [e.endMonth, e.endYear].filter(Boolean).join(' ') || e.endDate || '',
        responsibilities: (e.responsibilities || []).filter((r: string) => r && r.trim()),
      }));
    return {
      ...raw,
      photoUrl: this.photoUrl(),
      education: (raw.education || []).filter((e: any) => e.institution || e.degree),
      experience,
      skills: (raw.skills || []).filter((s: any) => s.name),
      languages: (raw.languages || []).filter((l: any) => l.name),
      certifications: (raw.certifications || []).filter((c: any) => c.name),
      projects: (raw.projects || []).filter((p: any) => p.name || p.description),
      references: (raw.references || []).filter((r: any) => r.name),
      hobbies: (raw.hobbies || []).filter((h: any) => h.name),
      typography: {
        fontSize: this.fontSize(),
        fontWeight: this.fontWeight(),
        lineHeight: this.lineHeight(),
        sectionLines: this.sectionLines(),
        fontFamily: this.fontFamily(),
      },
      accent: this.accentColor(),
      layout: this.layout(),
    };
  }

  patchFromContent(content: any) {
    if (!content || typeof content !== 'object') return;
    this.form.patchValue({
      fullName: content.fullName || '',
      jobTitle: content.jobTitle || '',
      email: content.email || '',
      phone: content.phone || '',
      location: content.location || '',
      linkedin: content.linkedin || '',
      summary: content.summary || '',
    });
    if (content.photoUrl) this.photoUrl.set(content.photoUrl);
    if (content.accent) this.accentColor.set(content.accent);
    if (content.typography) {
      if (content.typography.fontSize) this.fontSize.set(content.typography.fontSize);
      if (content.typography.fontWeight) this.fontWeight.set(content.typography.fontWeight);
      if (content.typography.lineHeight) this.lineHeight.set(content.typography.lineHeight);
      if (typeof content.typography.sectionLines === 'boolean') this.sectionLines.set(content.typography.sectionLines);
      if (content.typography.fontFamily) this.fontFamily.set(content.typography.fontFamily);
    }

    this.education.clear();
    if (Array.isArray(content.education) && content.education.length) {
      content.education.forEach((e: any) =>
        this.education.push(
          this.fb.group({
            institution: [e.institution || ''],
            degree: [e.degree || ''],
            field: [e.field || ''],
            startYear: [e.startYear || ''],
            endYear: [e.endYear || ''],
            current: [!!e.current],
            gpa: [e.gpa || ''],
            description: [e.description || ''],
          }),
        ),
      );
    } else {
      this.education.push(this.newEducation());
    }

    this.experience.clear();
    if (Array.isArray(content.experience) && content.experience.length) {
      content.experience.forEach((e: any) => {
        const resps = Array.isArray(e.responsibilities) && e.responsibilities.length ? e.responsibilities : [''];
        const { month: sm, year: sy } = this.splitDate(e.startDate || e.startMonth);
        const { month: em, year: ey } = this.splitDate(e.endDate || e.endMonth);
        this.experience.push(
          this.fb.group({
            company: [e.company || ''],
            position: [e.position || ''],
            startMonth: [e.startMonth || sm],
            startYear: [e.startYear || sy],
            endMonth: [e.endMonth || em],
            endYear: [e.endYear || ey],
            startDate: [e.startDate || ''],
            endDate: [e.endDate || ''],
            current: [!!e.current],
            responsibilities: this.fb.array(resps.map((r: string) => this.fb.control(r))),
          }),
        );
      });
    } else {
      this.experience.push(this.newExperience());
    }

    this.skills.clear();
    if (Array.isArray(content.skills)) {
      content.skills.forEach((s: any) => {
        if (typeof s === 'string') this.skills.push(this.fb.group({ name: [s], level: ['Intermediate'] }));
        else this.skills.push(this.fb.group({ name: [s.name || ''], level: [s.level || 'Intermediate'] }));
      });
    }

    this.languages.clear();
    if (Array.isArray(content.languages)) {
      content.languages.forEach((l: any) => {
        if (typeof l === 'string') this.languages.push(this.fb.group({ name: [l], proficiency: ['Intermediate'] }));
        else this.languages.push(this.fb.group({ name: [l.name || ''], proficiency: [l.proficiency || 'Intermediate'] }));
      });
    }

    this.certifications.clear();
    if (Array.isArray(content.certifications)) {
      content.certifications.forEach((c: any) => {
        if (typeof c === 'string') this.certifications.push(this.fb.group({ name: [c], issuer: [''], date: [''] }));
        else this.certifications.push(this.fb.group({ name: [c.name || ''], issuer: [c.issuer || ''], date: [c.date || ''] }));
      });
    }

    this.projects.clear();
    if (Array.isArray(content.projects) && content.projects.length) {
      content.projects.forEach((p: any) =>
        this.projects.push(this.fb.group({ name: [p.name || ''], description: [p.description || ''], link: [p.link || ''] })),
      );
    } else {
      this.projects.push(this.newProject());
    }

    this.references.clear();
    if (Array.isArray(content.references)) {
      content.references.forEach((r: any) =>
        this.references.push(this.fb.group({
          name: [r.name || ''], position: [r.position || ''],
          company: [r.company || ''], phone: [r.phone || ''], email: [r.email || ''],
        })),
      );
    }

    this.hobbies.clear();
    if (Array.isArray(content.hobbies)) {
      content.hobbies.forEach((h: any) => {
        const name = typeof h === 'string' ? h : h.name || '';
        if (name) this.hobbies.push(this.fb.group({ name: [name] }));
      });
    }

    if (content.layout) this.layout.set(content.layout);
  }

  splitDate(value?: string): { month: string; year: string } {
    if (!value) return { month: '', year: '' };
    const parts = String(value).trim().split(/\s+/);
    if (parts.length >= 2) return { month: parts[0], year: parts[1] };
    if (/^\d{4}$/.test(parts[0])) return { month: '', year: parts[0] };
    return { month: parts[0] || '', year: '' };
  }

  ensureCvId(): Promise<string | null> {
    if (this.cvId) return Promise.resolve(this.cvId);
    if (!this.templateId) return Promise.resolve(null);
    return new Promise((resolve) => {
      this.http.post<{ cv: { id: string | number } }>('/api/v1/cvs', { templateId: this.templateId }).subscribe({
        next: ({ cv }) => {
          this.cvId = String(cv.id);
          resolve(this.cvId);
        },
        error: () => resolve(null),
      });
    });
  }

  private autoSaveTimer: any = null;
  showDownloadModal = signal(false);

  scheduleAutoSave() {
    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
    this.autoSaveTimer = setTimeout(() => this.autoSave(), 30000);
  }

  async autoSave() {
    const id = this.cvId || (this.templateId ? await this.ensureCvId() : null);
    if (!id) return;
    const content = this.buildContent();
    this.http.put(`/api/v1/cvs/${id}`, { title: content.fullName || 'My CV', content }).subscribe({
      next: () => this.toast.info('Auto-saved'),
      error: () => {},
    });
  }

  async save() {
    const id = await this.ensureCvId();
    if (!id) {
      this.toast.error('Choose a template first to create your CV.');
      return;
    }
    const content = this.buildContent();
    this.http.put(`/api/v1/cvs/${id}`, { title: content.fullName || 'My CV', content }).subscribe({
      next: () => this.toast.success('Draft saved!'),
      error: () => this.toast.error('Could not save your draft.'),
    });
  }

  async downloadAs(format: 'pdf' | 'docx') {
    this.showDownloadModal.set(false);
    const id = await this.ensureCvId();
    if (id) {
      const content = this.buildContent();
      await new Promise<void>((resolve) => {
        this.http.put(`/api/v1/cvs/${id}`, { title: content.fullName || 'My CV', content }).subscribe({
          next: () => resolve(),
          error: () => resolve(),
        });
      });
    }

    if (format === 'pdf') {
      this.fullPreview.set(true);
      setTimeout(() => {
        window.print();
        this.toast.success('PDF ready! Check your downloads.');
      }, 400);
    } else {
      // DOCX: generate a simple HTML-based .doc file
      this.generateDocx();
    }
  }

  private generateDocx() {
    const content = this.buildContent();
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"><title>${content.fullName || 'My CV'}</title>
      <style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.5;margin:2cm}h1{font-size:22pt;margin:0 0 4pt}h2{font-size:14pt;border-bottom:1pt solid #333;padding-bottom:4pt;margin:14pt 0 8pt}h3{font-size:12pt;margin:8pt 0 2pt}p{margin:2pt 0}ul{margin:4pt 0;padding-left:18pt}.section{margin-bottom:14pt}</style></head>
      <body>
        <h1>${content.fullName || ''}</h1>
        <p><b>${content.jobTitle || ''}</b></p>
        <p>${[content.email, content.phone, content.location].filter(Boolean).join(' | ')}</p>
        ${content.linkedin ? `<p>${content.linkedin}</p>` : ''}
        ${content.summary ? `<div class="section"><h2>Professional Summary</h2><p>${content.summary}</p></div>` : ''}
        ${content.experience?.length ? `<div class="section"><h2>Work Experience</h2>${content.experience.map((e: any) => `<h3>${e.title || ''} — ${e.company || ''}</h3><p><i>${e.startMonth || ''} ${e.startYear || ''} – ${e.current ? 'Present' : (e.endMonth || '') + ' ' + (e.endYear || '')}</i> | ${e.location || ''}</p><p>${e.description || ''}</p>`).join('')}</div>` : ''}
        ${content.education?.length ? `<div class="section"><h2>Education</h2>${content.education.map((e: any) => `<h3>${e.degree || ''} in ${e.field || ''}</h3><p>${e.institution || ''} | ${e.startYear || ''} – ${e.endYear || ''}</p>${e.achievements ? `<p>${e.achievements}</p>` : ''}`).join('')}</div>` : ''}
        ${content.skills?.length ? `<div class="section"><h2>Skills</h2><ul>${content.skills.map((s: any) => `<li>${s.name} — ${s.level}</li>`).join('')}</ul></div>` : ''}
        ${content.languages?.length ? `<div class="section"><h2>Languages</h2><ul>${content.languages.map((l: any) => `<li>${l.name} — ${l.proficiency}</li>`).join('')}</ul></div>` : ''}
        ${content.certifications?.length ? `<div class="section"><h2>Certifications</h2><ul>${content.certifications.map((c: any) => `<li>${c.name} (${c.year || ''})</li>`).join('')}</ul></div>` : ''}
        ${content.projects?.length ? `<div class="section"><h2>Projects</h2>${content.projects.map((p: any) => `<h3>${p.name || ''}</h3><p>${p.description || ''}</p>`).join('')}</div>` : ''}
      </body></html>
    `;

    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.fullName || 'My_CV'}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast.success('DOCX downloaded! Open in Word to edit.');
  }

  async download() {
    this.showDownloadModal.set(true);
  }

  ngOnDestroy() {
    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
  }
}
