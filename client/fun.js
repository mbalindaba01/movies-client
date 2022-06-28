import * as fun from 'everyday-fun';

export default function Fun() {
  return {
    quote: {},
    previous: {},
    init() {
      this.nextQuote();

      setInterval(() => {
        this.quote = fun.getRandomQuote();
      }, 5000);
    },
    nextQuote() {
      this.quote = fun.getRandomQuote();
      this.previous = this.quote;
    },

    previousQuote() {
      const current = this.quote;
      this.quote = this.previous;
      this.previous = current;
    },

  };
}