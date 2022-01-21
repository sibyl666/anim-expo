import { StyleSheet, View, ViewProps, Image } from "react-native";
import { DefaultInOutRule, DefaultRules, defaultRules, outputFor, parserFor } from "simple-markdown";

import Text from "../components/Base/Text";
import Spoiler from "./Spoiler";

// REGEXES
const imgRegex = /^img(\d*)\((.*)\)/;
const spoilerRegex = /^~!(.*)!~/;
const centerRegex = /^~\~\~(.*)~\~\~/s;
const youtubeRegex = /^-youtube\((.*v=(.*))\)/;
const boldRegex = /^__(.*)__(.*)\n/;

const clearRegex = /(<br>)/gm;
const youtubeFix = /youtube/;

const rules: DefaultRules = {
  strong: {
    ...defaultRules.strong,
    order: defaultRules.text.order - 0.5,
    match: source => boldRegex.exec(source),
    parse: (capture, nestedParse, state) => {
      return {
        content: nestedParse(capture[1], state),
        rest: capture[2],
      };
    },
    react: (node, nestedOutput, state) => {
      return (
        <View style={{ flexDirection: "row" }}>
          <Text key={state.key} style={{ fontWeight: "bold", alignSelf: "flex-start", flexShrink: 1 }}>
            {nestedOutput(node.content, state)}
          </Text>
          <Text key={state.key as number + 1}>
            {node.rest}
          </Text>
        </View>
      );
    },
  },
  text: {
    ...defaultRules.text,
    // @ts-ignore
    react: (node, nestedOutput, state) => {
      return <Text key={state.key}>{node.content.trim()}</Text>;
    },
  },
  image: {
    ...defaultRules.image,
    match: source => imgRegex.exec(source),
    parse: capture => ({ link: capture[2], width: capture[1] }),
    react: (node, nestedOutput, state) => {
      return (
        <Image key={state.key} style={{ height: 200, width: 200 }} source={{ uri: node.link }} />
      );
    },
  },
};

const spoilerRule: Omit<DefaultInOutRule, "html"> = {
  order: 10,
  match: source => spoilerRegex.exec(source),
  parse: (capture, nestedParse, state) => {
    return { content: nestedParse(capture[1], state) }
  },
  react: (node, nestedOutput, state) => {
    return (
      <Spoiler key={state.key}>{nestedOutput(node.content)}</Spoiler>
    )
  },
};

const centerRule: Omit<DefaultInOutRule, "html"> = {
  order: 1,
  match: source => centerRegex.exec(source),
  parse: (capture, nestedParse, state) => {
    return {
      content: nestedParse(capture[1], state),
    };
  },
  react: (node, nestedOutput, state) => {
    return (
      <View key={state.key} style={{ alignItems: "center" }}>
        {nestedOutput(node.content)}
      </View>
    );
  },
};

const youtubeRule: Omit<DefaultInOutRule, "html"> = {
  order: 8,
  match: source => {
    return youtubeRegex.exec(source);
  },
  parse: capture => {
    // console.log(capture)
    return { link: capture[1], id: capture[2] };
  },
  react: (node, nestedOutput, state) => {
    return (
      <Image
        key={state.key}
        style={{ width: "100%", height: 200, borderRadius: 4, marginVertical: 4 }}
        source={{ uri: `https://img.youtube.com/vi/${node.id}/0.jpg` }}
      />
    );
  },
};

const parser = parserFor(
  { ...rules, spoiler: spoilerRule, center: centerRule, youtube: youtubeRule },
  { inline: true }
);
const reactOut = outputFor({ ...rules, spoiler: spoilerRule, center: centerRule, youtube: youtubeRule }, "react");

interface MarkdownProps extends ViewProps {
  children: string
}

const Markdown = ({ style, children }: MarkdownProps) => {
  let text = children.replace(clearRegex, "-?");
  text = text.replace(youtubeFix, "-youtube");
  const parsedTree = parser(text);
  
  return (
    <View style={styles.container}>
      {reactOut(parsedTree)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Markdown;
