import { StyleSheet } from "react-native";
import { DefaultInOutRule } from "simple-markdown";
import Text from "../components/Base/Text";

const strongRegex = /^(__|\*\*)(.*)(__|\*\*)/;

const ruleStrong: DefaultInOutRule = {
  order: 1,
  match: (source) => {
    return strongRegex.exec(source)
  },
  parse: (capture, nestedParse, state) => {
    return {
      content: nestedParse(capture[2], state),
    }
  },
  react: (node, nestedOutput, state) => {
    return (
      <Text key={state.key} style={styles.bold}>
        {nestedOutput(node.content, state)}
      </Text>
    )
  },
  html: () => "",
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
    alignSelf: "flex-start",
  }
})

export default ruleStrong;
