import type { Block, LayoutData, MediaItem } from '../../src/types'

export const exampleBlocks: Block[] = [
  { type: 'paragraph', tag: 'p', text: 'Hei, kaffeelskere! Vi i Bøllefrø er stolte av å lansere bloggen vår. Her vil vi dele alt fra bryggeguider og kaffetips til historier om bønnene våre og folkene bak dem. Vi har jobbet lenge med å finne de beste bønnene fra små gårder rundt om i verden, og nå vil vi endelig dele reisen vår med dere.' },
  { type: 'heading', tag: 'h2', text: 'Hva kan du forvente?' },
  { type: 'paragraph', tag: 'p', text: 'Vi planlegger å skrive om alt som har med kaffe å gjøre. Fra hvordan vi velger ut bønner fra små gårder rundt om i verden, til hvordan du kan få mest mulig ut av kaffen hjemme. Vi vil også dele nyheter om nye produkter og sesonger. Kaffe er så mye mer enn bare en drikk — det er en kultur, en lidenskap, og en daglig rituell som vi ønsker å gjøre enda bedre for deg.' },
  { type: 'paragraph', tag: 'p', text: 'Hver uke vil vi publisere nye artikler om alt fra bryggemetoder og utstyr til reiser til kaffegårder og intervjuer med folk i bransjen. Vi tror at jo mer du vet om kaffen din, desto bedre smaker den. Og vi vil gjøre det enkelt og tilgjengelig for alle — enten du er nybegynner eller erfaren barista.' },
  { type: 'heading', tag: 'h2', text: 'Hvem er Bøllefrø?' },
  { type: 'paragraph', tag: 'p', text: 'Bøllefrø er et mikrorosteri basert i Sandnes, Rogaland. Vi røster kaffe i små partier for å sikre topp kvalitet i hver eneste kopp. Vårt mål er enkelt: å få spesialkaffe hjem til deg så enkelt som mulig. Vi startet som et lite hobbyprosjekt i en garasje, og har vokst til å bli et ordentlig mikrorøsteri med kunder over hele Rogaland og utover.' },
  { type: 'paragraph', tag: 'p', text: 'Vi samarbeider direkte med bønder i Kenya, Colombia, Etiopia og Brasil for å finne de mest spennende og smaksrike bønnene. Hver opprinnelse har sin egen karakter — fra de fruktige og florale smakene fra Kirinyaga i Kenya, til de sjokoladige og nøtteaktige profilene fra Huila i Colombia. Vi røster hver opprinnelse individuelt for å fremheve de unike smaksnotene.' },
  { type: 'heading', tag: 'h2', text: 'Kaffe med sjel' },
  { type: 'paragraph', tag: 'p', text: 'For oss handler kaffe om mer enn bare smak. Det handler om menneskene som dyrker den, om miljøet den vokser i, og om øyeblikkene den skaper. En god kopp kaffe kan gjøre en vanlig tirsdag morgen til noe spesielt. Det er den følelsen vi vil gi deg med hver eneste pose fra Bøllefrø.' },
  { type: 'paragraph', tag: 'p', text: 'Følg med for mer innhold. Vi gleder oss til å dele vår kaffelidenskap med deg!' },
]

const CMS_URL = ''

export const exampleLayout: LayoutData = {
  editorWidth: 700,
  images: [
    {
      mediaId: 4,
      filename: 'chemex-kaffe.jpeg',
      alt: 'Chemex kaffe',
      url: `/images/chemex-kaffe.jpeg`,
      aspectRatio: 1.58,
      anchorBlockIndex: 5,
      anchorWordIndex: 22,
      anchorWord: 'kopp.',
      x: 539,
      width: 127,
      float: 'right' as const,
    },
    {
      mediaId: 3,
      filename: 'chemex-brygging.jpeg',
      alt: 'Chemex brygging',
      url: `/images/chemex-brygging.jpeg`,
      aspectRatio: 1.013,
      anchorBlockIndex: 2,
      anchorWordIndex: 1,
      anchorWord: 'planlegger',
      x: 397,
      width: 167,
      float: 'right' as const,
      polygon: [
        { x: 0.778, y: 0.251 },
        { x: 0.691, y: 0.550 },
        { x: 0.827, y: 0.964 },
        { x: 0.123, y: 0.989 },
        { x: 0.302, y: 0.641 },
        { x: 0.247, y: 0.233 },
        { x: 0.525, y: 0.044 },
        { x: 0.790, y: 0.245 },
      ],
    },
    {
      mediaId: 5,
      filename: 'javaccino.jpeg',
      alt: 'Javaccino kaffe illustrasjon',
      url: `/images/javaccino.jpeg`,
      aspectRatio: 0.713,
      anchorBlockIndex: 8,
      anchorWordIndex: 39,
      anchorWord: 'Det',
      x: 8,
      width: 132,
      float: 'right' as const,
    },
  ],
}

export const exampleMedia: MediaItem[] = [
  {
    id: 3,
    filename: 'chemex-brygging.jpeg',
    url: `/images/chemex-brygging.jpeg`,
    alt: 'Chemex brygging',
    width: 543,
    height: 550,
  },
  {
    id: 4,
    filename: 'chemex-kaffe.jpeg',
    url: `/images/chemex-kaffe.jpeg`,
    alt: 'Chemex kaffe',
    width: 734,
    height: 1160,
  },
  {
    id: 5,
    filename: 'javaccino.jpeg',
    url: `/images/javaccino.jpeg`,
    alt: 'Javaccino kaffe illustrasjon',
    width: 564,
    height: 402,
  },
]
