export const formatText = (text: string): string => {
    return text
      .replace(/\r\n|\r|\n/g, '\n')                      // normalize line endings
      .replace(/[ \t]+/g, ' ')                            // collapse multiple spaces/tabs into one space
      .replace(/\s*([.,!?;:])\s*/g, '$1 ')                // space after punctuation
      .replace(/ +\n/g, '\n')                             // remove trailing spaces at line ends
      .replace(/\n{3,}/g, '\n\n')                         // limit multiple blank lines to 2
      .trim();                                            // trim start and end
  };
  