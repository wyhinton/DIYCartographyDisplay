import { EventLevel } from "../enums";
import { RawEventRowValues } from "../model/sheet_data_models";

export class TimelineEvent {
  start!: Date;
  end!: Date;
  title!: string;
  info!: string;
  category!: EventLevel;

  constructor(row: RawEventRowValues) {
    const cat_string: string = row.category;
    const type_cat: EventLevel =
      EventLevel[cat_string as unknown as keyof typeof EventLevel];

    this.start = new Date(row.start);
    this.end = new Date(row.end);
    this.info = row.info;
    this.category = type_cat;
  }
}
