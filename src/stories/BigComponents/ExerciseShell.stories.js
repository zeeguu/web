import * as s from "../../exercises/Exercises.sc";

export default {
  title: "BigComponents/ExerciseShell",
  component: s.ExercisesColumn,
};

export const Default = {
  render: () => (
    <s.ExercisesColumn>
      <div id="exerciseTopbar">
        <div id="topbarRow">
          <div>Timer</div>
        </div>
      </div>

      <s.ExForm>
        <div>
          <h3>Translate the sentence</h3>
          <p>I have been learning a lot lately.</p>
          <input placeholder="Type your answer" />
          <button type="button">Check</button>
        </div>
      </s.ExForm>
    </s.ExercisesColumn>
  ),
};
