import config from "../utils/config";

const define = async (word: any) => {
  const response = await fetch(`https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/${word}?fields=definitions%2Cexamples%2Cpronunciations&strictMatch=false`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      app_id: config.OXFORD_APP_ID as string,
      app_key: config.OXFORD_APP_KEY as string,
    },
  });
  return response.json();
};

const define2 = async (word: any) => {
  const response = await fetch(`https://od-api.oxforddictionaries.com/api/v2/sentences/en/${word}?strictMatch=false
  `, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      app_id: config.OXFORD_APP_ID as string,
      app_key: config.OXFORD_APP_KEY as string,
    },
  });
  return response.json();
};

export default { define, define2 };
