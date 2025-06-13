const formatString = {
  kebabCase(str: string): string {
    return str.split(" ").join("-").toLowerCase();
  },
  capitaliseFirst(str: string, onlyFirst = false) {
    if (!str) return "";
    const firstLetter = str.charAt(0).toUpperCase();
    const restLetters = onlyFirst ? str.slice(1) : str.slice(1).toLowerCase();
    return firstLetter + restLetters;
  },
  normalCase(input: string | Array<string>) {
    let strings = []
    if (Array.isArray(input)) {
      strings = input;
    } else {
      strings = input.split(" ");
    }
    return strings.map((str) => this.capitaliseFirst(str)).join(" ");
  },
  kebabToNormalCase(kebab: string, onlyFirst = false): string {
    return kebab
      .split('-')
      .map((word) => this.capitaliseFirst(word, onlyFirst))
      .join(' ');
  },
  stringToHTML(str: string): string {
    const specialCharDict = [
      ['\n', '<br>'],
      ['\t', '&nbsp;&nbsp;&nbsp;&nbsp;'],
    ];

    let newStr = str;

    for (const [char, replacement] of specialCharDict) {
      newStr = newStr.split(char).join(replacement);
    }

    console.table([str, newStr])
    return newStr;
  }
};

export default formatString;