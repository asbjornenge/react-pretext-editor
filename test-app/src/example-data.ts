import type { LayoutData } from '../../src/types'

export const exampleMarkdown = `Hei, kaffeelskere! Vi i **Bøllefrø** er stolte av å lansere bloggen vår. Her vil vi dele alt fra bryggeguider og kaffetips til historier om bønnene våre og folkene bak dem. Vi har jobbet lenge med å finne de beste bønnene fra små gårder rundt om i verden, og nå vil vi endelig dele reisen vår med dere.

## Hva kan du forvente?

Vi planlegger å skrive om alt som har med kaffe å gjøre. Fra hvordan vi velger ut bønner fra *små gårder* rundt om i verden, til hvordan du kan få mest mulig ut av kaffen hjemme. Vi vil også dele nyheter om nye produkter og sesonger. Kaffe er så mye mer enn bare en drikk — det er en **kultur**, en *lidenskap*, og en daglig rituell som vi ønsker å gjøre enda bedre for deg.

Hver uke vil vi publisere nye artikler om alt fra bryggemetoder og utstyr til reiser til kaffegårder og intervjuer med folk i bransjen. Vi tror at jo mer du vet om kaffen din, desto bedre smaker den.

## Hvem er Bøllefrø?

Bøllefrø er et mikrorosteri basert i **Sandnes, Rogaland**. Vi røster kaffe i små partier for å sikre topp kvalitet i hver eneste kopp. Vårt mål er enkelt: å få spesialkaffe hjem til deg så enkelt som mulig.

Vi samarbeider direkte med bønder i:

- **Kenya** — fruktige og florale smaker fra *Kirinyaga*
- **Colombia** — sjokoladige og nøtteaktige profiler fra *Huila*
- **Etiopia** — komplekse og blomsteraktige noter
- **Brasil** — klassisk nøtteaktig og karamell

> Kaffe er ikke bare en drikk. Det er en reise fra jord til kopp, fra bonde til barista.

## Kaffe med sjel

For oss handler kaffe om mer enn bare smak. Det handler om menneskene som dyrker den, om miljøet den vokser i, og om øyeblikkene den skaper. En god kopp kaffe kan gjøre en vanlig tirsdag morgen til noe **spesielt**.

Følg med for mer innhold. Vi gleder oss til å dele vår kaffelidenskap med deg!`

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
      x: 539,
      y: 500,
      width: 127,
    },
    {
      mediaId: 3,
      filename: 'chemex-brygging.jpeg',
      alt: 'Chemex brygging',
      url: `/images/chemex-brygging.jpeg`,
      aspectRatio: 1.013,
      x: 397,
      y: 130,
      width: 167,
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
      x: 8,
      y: 850,
      width: 132,
    },
  ],
}