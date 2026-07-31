import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CvCertification,
  CvEducation,
  CvExperience,
  CvLanguage,
  CvProject,
  CvSkill,
  ProfessionalCvComponent,
} from '../professional-cv/professional-cv.component';
import { ClassicBlueCvComponent } from '../classic-blue-cv/classic-blue-cv.component';
import { ExecutiveNavyCvComponent } from '../executive-navy-cv/executive-navy-cv.component';
import { SlatePortfolioCvComponent } from '../slate-portfolio-cv/slate-portfolio-cv.component';

export const CV_LAYOUTS = ['professional', 'classic-blue', 'executive-navy', 'slate-portfolio'] as const;

export type CvLayout = (typeof CV_LAYOUTS)[number];

export function normalizeLayout(value: unknown): CvLayout {
  return CV_LAYOUTS.includes(value as CvLayout) ? (value as CvLayout) : 'professional';
}

/** Renders CV content with whichever layout the chosen template declares. */
@Component({
  selector: 'app-cv-renderer',
  standalone: true,
  imports: [
    CommonModule,
    ProfessionalCvComponent,
    ClassicBlueCvComponent,
    ExecutiveNavyCvComponent,
    SlatePortfolioCvComponent,
  ],
  template: `
    @if (layout === 'slate-portfolio') {
      <app-slate-portfolio-cv
        [accent]="accent"
        [name]="name"
        [jobTitle]="jobTitle"
        [email]="email"
        [phone]="phone"
        [location]="location"
        [linkedin]="linkedin"
        [summary]="summary"
        [photoUrl]="photoUrl"
        [education]="education"
        [experience]="experience"
        [skills]="skills"
        [languages]="languages"
        [certifications]="certifications"
        [projects]="projects"
      />
    } @else if (layout === 'executive-navy') {
      <app-executive-navy-cv
        [accent]="accent"
        [name]="name"
        [jobTitle]="jobTitle"
        [email]="email"
        [phone]="phone"
        [location]="location"
        [linkedin]="linkedin"
        [summary]="summary"
        [photoUrl]="photoUrl"
        [education]="education"
        [experience]="experience"
        [skills]="skills"
        [languages]="languages"
        [certifications]="certifications"
        [projects]="projects"
      />
    } @else if (layout === 'classic-blue') {
      <app-classic-blue-cv
        [accent]="accent"
        [name]="name"
        [jobTitle]="jobTitle"
        [email]="email"
        [phone]="phone"
        [location]="location"
        [linkedin]="linkedin"
        [summary]="summary"
        [photoUrl]="photoUrl"
        [education]="education"
        [experience]="experience"
        [skills]="skills"
        [languages]="languages"
        [certifications]="certifications"
        [projects]="projects"
      />
    } @else {
      <app-professional-cv
        [accent]="accent"
        [name]="name"
        [jobTitle]="jobTitle"
        [email]="email"
        [phone]="phone"
        [location]="location"
        [linkedin]="linkedin"
        [summary]="summary"
        [photoUrl]="photoUrl"
        [education]="education"
        [experience]="experience"
        [skills]="skills"
        [languages]="languages"
        [certifications]="certifications"
        [projects]="projects"
        [fontSize]="fontSize"
        [fontWeight]="fontWeight"
        [lineHeight]="lineHeight"
        [sectionLines]="sectionLines"
      />
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class CvRendererComponent {
  @Input() layout: CvLayout = 'professional';
  @Input() accent = '#667b97';
  @Input() name = '';
  @Input() jobTitle = '';
  @Input() email = '';
  @Input() phone = '';
  @Input() location = '';
  @Input() linkedin = '';
  @Input() summary = '';
  @Input() photoUrl: string | null = null;
  @Input() education: CvEducation[] = [];
  @Input() experience: CvExperience[] = [];
  @Input() skills: CvSkill[] = [];
  @Input() languages: CvLanguage[] = [];
  @Input() certifications: CvCertification[] = [];
  @Input() projects: CvProject[] = [];

  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.4;
  @Input() sectionLines = true;
}
