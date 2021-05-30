import { StudentClass } from "./student";

export interface LightboxImage {
  src: string;
  title: string;
}
export class LightBoxData {
  images!: LightboxImage[];
  description!: string;
  author!: string;
  title!: string;
  year!: string;
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
    this.images = student.get_lightbox_images();
    this.author = student.author;
    this.title = student.title;
    this.description = student.description;
    this.year = student.year;
    this.discipline = student.discipline;
  }
}
