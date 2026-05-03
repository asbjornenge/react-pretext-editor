import type { LayoutData } from '../../src/types'

export const exampleMarkdown = `**Specialty coffee** is a term for the highest grade of coffee available, typically relating to the entire supply chain, using single-origin or single-estate coffee.[1][2] The **term** was first used in 1974 by Erna Knutsen in an issue of Tea & Coffee Trade Journal. Knutsen used specialty coffee to describe beans of the best flavor which are produced in special micro-climates.[3]

Specialty coffee is related to the farmers and the brewer what is known as the third wave of coffee,[4] especially throughout North America. This refers to a modern demand for exceptional quality coffee, both farmed and brewed to a significantly higher than average standard. Eplekake. Test.

## Definition

The widely accepted definition of specialty coffee is coffee scoring 80 points or above on the 100-point scale used on the Specialty Coffee Association Cupping form. Coffee scoring from 90 to 100 is graded Outstanding, coffee that scores 85–89.99 is graded Excellent, while coffee scoring 80–84.99 is graded Very Good.[3]

The Specialty Coffee Association has a series of more detailed specifications (SCA is the union of the Specialty Coffee Association of American (SCAA) and Europe (SCAE)[5]). The SCA sets standards for specialty coffee at every stage of the coffee production, including allowable defects in green beans, water standards, and brew strength. The SCA also sets clear standards on the coffee grading process.[6] A minimum requirement for a specialty coffee is the number of defects: to be considered specialty a coffee must have 0 to 5 defects every 350 g (12 ounces) of milled beans.

Although there are different definitions of specialty coffee according to different international organisations, there is a general acceptance of a set of three minimum requirements: coffee should have been hand-picked by selective picking of mature beans, scoring 80 or above, maximum 5 defects per 350 g (12 ounces).

Many organisations and activists are working to include strict environmental and social indicators in the definition and grading of specialty coffee. For example, biologist Giorgio Piracci, president of the Peruvian NGO 7Elements Peru[7] and producer of the first specialty coffee produced applying permaculture ethics and principles, argues that "there's a urgent need to redefine the concept of quality and to embed into it the environmental and socio-economic quality component both at production and distribution level"; according to his vision, "it makes no sense to talk about an 'excellent' coffee if this is produced using harmful pesticides, fertilisers or environmentally impacting farming techniques; in the same way, how can we talk about excellence if a cup of coffee is produced thanks to modern forms of slavery and human exploitation?"[8]`

const CMS_URL = ''

export const exampleLayout: LayoutData = {
  editorWidth: 700,
  images: [
    {
      mediaId: 4,
      filename: 'chemex-kaffe.jpeg',
      alt: 'Chemex coffee',
      url: `/images/chemex-kaffe.jpeg`,
      aspectRatio: 1.58,
      x: 539,
      y: 400,
      width: 127,
    },
    {
      mediaId: 3,
      filename: 'chemex-brygging.jpeg',
      alt: 'Chemex brewing',
      url: `/images/chemex-brygging.jpeg`,
      aspectRatio: 1.013,
      x: 397,
      y: 80,
      width: 167,
    },
    {
      mediaId: 5,
      filename: 'javaccino.jpeg',
      alt: 'Javaccino coffee illustration',
      url: `/images/javaccino.jpeg`,
      aspectRatio: 0.713,
      x: 8,
      y: 600,
      width: 132,
    },
  ],
}