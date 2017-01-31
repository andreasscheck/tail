import { TailPage } from './app.po';

describe('tail App', function() {
  let page: TailPage;

  beforeEach(() => {
    page = new TailPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
