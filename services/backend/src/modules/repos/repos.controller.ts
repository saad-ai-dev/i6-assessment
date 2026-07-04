import { Controller, Get, Param } from '@nestjs/common';
import { ReposService } from './repos.service';

@Controller('api/v1/repos/:owner/:repo')
export class ReposController {
  constructor(private readonly reposService: ReposService) {}

  @Get('commits')
  getCommits(@Param('owner') owner: string, @Param('repo') repo: string) {
    return this.reposService.getCommits(owner, repo);
  }

  @Get('authors')
  getAuthors(@Param('owner') owner: string, @Param('repo') repo: string) {
    return this.reposService.getAuthors(owner, repo);
  }

  @Get('comments')
  getComments(@Param('owner') owner: string, @Param('repo') repo: string) {
    return this.reposService.getComments(owner, repo);
  }
}
