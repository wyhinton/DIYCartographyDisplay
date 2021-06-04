import {
  AuthorDisciplineFilter,
  ThemeCategoryFilter,
  MapSubTopic,
  Topic,
} from "./enums";
import type { RawStudentRowValues } from "./sheet_data_models";
import type { LightboxImage } from "./lightbox";
import type { GalleryImage } from "./map_data";
import { idText } from "typescript";
interface ImageData {
  src: string;
  title: string;
}

export enum SeriesId {
  series0101 = "series0101",
  series0102 = "series0102",
  series0201 = "series0201",
  series0202 = "series0202",
}

function request_image(image_url: string): Promise<HTMLImageElement> {
  // function get_image(image: GalleryImage): Promise<HTMLImageElement> {
  const promise = new Promise<HTMLImageElement>(function (resolve, reject) {
    let img = new Image();
    img.src = image_url as string;

    // img.src = image.thumbnail;
    img.onload = () => {
      resolve(img);
    };
    // img.onerror = () =>{
    //   resolve()
    // }
    // if (error){

    // }
  });
  console.log(image_url, promise);
  return promise;
}

export class StudentClass {
  author!: string;
  year!: string;
  title!: string;
  description!: string;
  discipline!: AuthorDisciplineFilter;
  topic!: Topic;
  subtopic!: MapSubTopic;
  theme!: ThemeCategoryFilter;
  image_data!: Map<SeriesId, string>;
  gallery_images!: GalleryImage[];

  request_gallery_thumbnail(
    id: SeriesId
  ): Promise<HTMLImageElement> | undefined {
    if (this.image_data.has(id)) {
      let test = this.image_data.get(id) ?? ("" as string);
      let req = request_image(test);
      return req;
    }
  }
  get_lightbox_images(): LightboxImage[] {
    let lightbox_image_arr: LightboxImage[] = [];
    for (let elem of this.image_data.entries()) {
      const new_img = {
        title: elem[0],
        src: elem[1] as string,
      };
      lightbox_image_arr.push(new_img);
    }
    return lightbox_image_arr;
  }
  get_gallery_images(): GalleryImage[] {
    return this.gallery_images;
  }
  create_gallery_image(key: SeriesId, full_size_img: HTMLImageElement) {
    const src = this.image_data.get(key);
    const thumbnail_src = src;

    let gallery_image = {
      src: src as string,
      thumbnail: thumbnail_src as string,
      isSelected: false,
      caption: "Im in this other file",
      thumbnailWidth: full_size_img.width * 0.1,
      thumbnailHeight: full_size_img.height * 0.1,
      tags: [
        {
          author: this.author,
          discipline:
            AuthorDisciplineFilter[
              this.discipline as unknown as keyof typeof AuthorDisciplineFilter
            ],
          subtopic:
            MapSubTopic[
              // (single_row.tags + "_" +
              this.subtopic as unknown as keyof typeof MapSubTopic
            ],
          theme:
            ThemeCategoryFilter[
              this.theme as unknown as keyof typeof ThemeCategoryFilter
            ],
          year: this.year,
        },
      ],
    };
    this.gallery_images.push(gallery_image);
    // );
    // return gallery_image;
  }
  // first_image.thumbnailWidth = img.width * 0.1;
  // first_image.thumbnailHeight = img.height * 0.1;
  set_gallery_images(gi: GalleryImage[]) {
    this.gallery_images = gi;
  }
  constructor(row: RawStudentRowValues) {
    let pairArr: [SeriesId, string][] = [];

    //get all the image seriesfields
    for (let key of Object.keys(row)) {
      if (Object.keys(SeriesId).includes(key)) {
        const keyTyped = key as keyof typeof row;
        if (row[keyTyped] !== "NA") {
          const new_pair: [SeriesId, string] = [
            SeriesId[key as unknown as keyof typeof SeriesId],
            row[keyTyped] as string,
          ];
          pairArr.push(new_pair);
        }
      }
    }

    const image_map = new Map(pairArr);
    this.author = row.author;
    this.year = row.year;
    this.title = row.title;
    this.description = row.info;
    this.discipline =
      AuthorDisciplineFilter[
        row.discipline as unknown as keyof typeof AuthorDisciplineFilter
      ];
    this.topic = Topic[row.topic as unknown as keyof typeof Topic];
    this.theme =
      ThemeCategoryFilter[
        row.theme as unknown as keyof typeof ThemeCategoryFilter
      ];
    this.subtopic =
      MapSubTopic[row.subtopic as unknown as keyof typeof MapSubTopic];
    this.image_data = image_map;
    this.gallery_images = [];
  }
}
