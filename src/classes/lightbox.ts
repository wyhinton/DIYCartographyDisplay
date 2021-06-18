import { StudentClass } from "./student";

export interface LightboxImage {
  src: string;
  title: string;
}
/**
 * Holds data for the active lightbox.
 * Initializes to any empty lightbox, ingests a Student.
 */
export class LightBoxData {
  /**
   * The images to display
   */
  images!: LightboxImage[];
  /**
   * Text about the map
   */
  description!: string;
  /**
   * Student who created the map
   */
  author!: string;
  /**
   * Title of the series01 map
   */
  title!: string;
  /**
   * Year of the student
   */
  year!: string;
  /**Disciplien of the student */
  discipline!: string;

  constructor() {
    this.images = [];
    this.description = "";
    this.author = "";
    this.title = "";
    this.year = "";
    this.discipline = "";
  }
  set_student(student: StudentClass) {
    this.images = student.getLightboxImages();
    this.author = student.author;
    this.title = student.title;
    this.description = student.description;
    this.year = student.year;
    this.discipline = student.discipline;
  }
}
