export const DUMMYLIST = [
    {
      authors: "Daniel Boffey",
      feed_id: [110],
      feed_image_url: "https://zeeguu.unibe.ch/api/resources/guardianweekly.png",
      icon_name: "guardianweekly.png",
      id: 1485807,
      language: "en",
      liked: false,
      metrics: { difficulty: 0.63, word_count: 611 },
      opened: true,
      published: "2021-03-30T16:55:34.000000Z",
      starred: false,
      summary:
        "Britain will join China in being locked out of research with the EU on cutting-edge quantum technology, such as new breeds of supercomputers, due to security concerns under a European commission proposal opposed by academics and 19 member states.↵↵At a meeting on Friday, commission officials said th",
      title: "EU plan threatens British participation in hi-tech research",
      topics: "Technology Travel Food ",
      url:
        "https://www.theguardian.com/world/2021/mar/30/eu-plan-threatens-british-participation-in-hi-tech-research",
    },
    {
      authors: "",
      feed_id: [102],
      feed_image_url: "https://zeeguu.unibe.ch/api/resources/onion.jpg",
      icon_name: "onion.jpg",
      id: 1484630,
      language: "en",
      liked: false,
      metrics: {difficulty: 0.65, word_count: 190},
      opened: true,
      published: "2021-03-29T19:00:00.000000Z",
      starred: false,
      summary: "WASHINGTON—Promising to assist nations that lack the bargaining power to negotiate with drug manufacturers, President Joe Biden issued assurances Monday that the United States would donate Covid vaccinations to impoverished countries as soon as officials had finished inoculating all of America’s tre",
      title: "Biden Assures Impoverished Countries That Vaccine Donations Coming Right After U.S. Inoculates Trees",
      topics: "Satire ",
      url: "https://www.theonion.com/biden-assures-impoverished-countries-that-vaccine-donat-1846575012",
    },{
      authors: "",
  feed_id: [102],
  feed_image_url: "https://zeeguu.unibe.ch/api/resources/onion.jpg",
  icon_name: "onion.jpg",
  id: 1495789,
  language: "en",
  liked: null,
  metrics: {difficulty: 0.68, word_count: 208},
  opened: false,
  published: "2021-04-08T12:00:00.000000Z",
  starred: false,
  summary: "CHICAGO—Squeaking wildly to one another as the almost forgotten sound of human footsteps echoed through the lobby, a swarm of rats scrambled to hide their miniature, fully functioning amusement park and resort before workers returned to a local office building, reports confirmed Wednesday. According",
  title: "Rats Scramble To Hide Fully Functioning Amusement Park And Resort They Built As Workers Return To Office",
  topics: "Satire ",
  
  url: "https://www.theonion.com/rats-scramble-to-hide-fully-functioning-amusement-park-1846606703",
    }
  ];
  
  export function CreateDummyClassForm() {
    const form = new FormData()
    form.append('name', "DUMMYclass")
    form.append('inv_code', "DUMMYcode")
    form.append('max_students', 50)
    form.append('language_id', "es")
    return form
  }

  export const DUMMYSTUDENTS = [
    {
        cohort_name: "ClassName 1",
        email: "email1@email.com",
        exercise_time_list: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 74, 71.414],
        exercises_done: 145.414,
        id: "2671",
        last_article: "place holder article",
        reading_percentage: 18.03690802304215,
        name: "Olivia One",
        normalized_activity_proportion: 23.942510121457488,
        reading_time: 32,
        reading_time_list:[22, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total_time: 177.414
    },
    {
        cohort_name: "ClassName 1",
        email: "email2@email.com",
        exercise_time_list: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        exercises_done: 0,
        id: "2673",
        last_article: "place holder article",
        reading_percentage: 100,
        name: "Toby Two",
        normalized_activity_proportion: 100,
        reading_time: 741,
        reading_time_list:[741, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total_time: 741,
    }
  ]