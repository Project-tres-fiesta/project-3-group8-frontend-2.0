// app.config.js
import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    name: "StickerSmash",
    slug: "stickersmash",
    version: "1.0.0",
    extra: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            extraStrings: {
              // This will generate <string name="google_client_id">...</string> in strings.xml
              google_client_id: process.env.GOOGLE_CLIENT_ID,
            },
          },
        },
      ],
    ],
  };
};
