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

export type CvLayout = 'professional' | 'classic-blue';

export function normalizeLayout(value: unknown): CvLayout {
  return value === 'classic-blue' ? 'classic-blue' : 'professional';
}

/** Renders CV content with whichever layout the chosen template declares. */
@Component({
  selector: 'app-cv-renderer',
  standalone: true,
  imports: [CommonModule, ProfessionalCvComponent, ClassicBlueCvComponent],
  template: `
    @if (layout === 'classic-blue') {
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
