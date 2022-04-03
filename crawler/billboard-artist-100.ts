import axios from 'axios';
import cheerio from 'cheerio';
import {ArtistData, removeLineFeed, save} from '.';

(async () => {
  const res = await axios('https://www.billboard.com/charts/artist-100/');

  const $ = cheerio.load(res.data);

  const data: ArtistData[] = [];
  $('.o-chart-results-list-row-container').each((idx, elem) => {
    const lastWeekRank = removeLineFeed(
      $('.o-chart-results-list__item:nth-child(4) > span', elem).first().text(),
    );

    data.push({
      name: removeLineFeed($(elem).find('h3#title-of-a-story').first().text()),
      image: $('img', elem).first().attr('data-lazy-src') || '',
      rank: idx + 1,
      last_week_rank: lastWeekRank === '-' ? null : Number(lastWeekRank),
      peak_rank: Number(
        removeLineFeed(
          $(elem)
            .find('.o-chart-results-list__item:nth-child(5) > span')
            .first()
            .text(),
        ),
      ),
      weeks_on_chart: Number(
        removeLineFeed(
          $(elem)
            .find('.o-chart-results-list__item:nth-child(6) > span')
            .first()
            .text(),
        ),
      ),
    });
  });
  save(data, 'billboard-artist-100');
})();
