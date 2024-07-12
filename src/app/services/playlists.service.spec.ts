import { TestBed } from '@angular/core/testing';

import { PlaylistsService } from './playlists.service';

describe('PlaylistServiceService', () => {
  let service: PlaylistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaylistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
