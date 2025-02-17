import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { InterviewService } from '../interview/interview.service';
import { getPreviewFromVideoLink } from '../../utils/youtube-preview.util';

@Controller()
export class AppController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  @Render('index')
  async getHello() {
    const pastInterviews = (await this.interviewService.getPast()).map(
      interview => {
        return {
          ...interview,
          ...{ preview: getPreviewFromVideoLink(interview.videoLink) },
        };
      },
    );

    const comingInterviews = (await this.interviewService.getComing()).map(
      interview => {
        return {
          ...interview,
          ...{ preview: getPreviewFromVideoLink(interview.videoLink) },
        };
      },
    );

    return { comingInterviews, pastInterviews };
  }
}
