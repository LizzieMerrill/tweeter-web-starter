import { StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  loadStory(
    userAlias: string,
    pageSize: number,
    lastItem?: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  loadFeed(
    userAlias: string,
    pageSize: number,
    lastItem?: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  postStatus(newStatus: StatusDto): Promise<void>;
}
