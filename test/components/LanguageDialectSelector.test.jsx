import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LanguageDialectSelector from "../../src/components/LanguageDialectSelector";

/**
 * What a learner sees when asked which variety of their language to be read in.
 *
 * These assertions are the ones that were previously answerable only by logging
 * into the app and looking, which is why the control shipped with a "please check
 * this by hand" note on its pull request.
 */
describe("LanguageDialectSelector", () => {
  const portuguese = [
    { country: "PT", name: "European Portuguese" },
    { country: "BR", name: "Brazilian Portuguese" },
  ];

  function pills() {
    return screen.getAllByRole("radio").map((pill) => pill.textContent);
  }

  it("shows one pill per dialect and no 'Everywhere'", () => {
    // The feed's control has an "Everywhere" option and this one must not:
    // there is no being read to in no particular accent.
    render(<LanguageDialectSelector dialects={portuguese} selectedValue={""} onChange={() => {}} />);

    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(pills().join(" ")).not.toMatch(/everywhere/i);
  });

  it("names each pill by its country, not by the variety's full name", () => {
    // "Brazilian Portuguese" is the tooltip; a row of pills has to fit a phone.
    render(<LanguageDialectSelector dialects={portuguese} selectedValue={""} onChange={() => {}} />);

    expect(pills().join(" ")).toMatch(/Brazil/);
    expect(pills().join(" ")).not.toMatch(/Brazilian Portuguese/);
  });

  it("preselects the first when the learner has no preference", () => {
    // Nothing selected would misdescribe what they already hear.
    render(<LanguageDialectSelector dialects={portuguese} selectedValue={""} onChange={() => {}} />);

    const [european, brazilian] = screen.getAllByRole("radio");
    expect(european).toHaveAttribute("aria-checked", "true");
    expect(brazilian).toHaveAttribute("aria-checked", "false");
  });

  it("selects the stored dialect when there is one", () => {
    render(<LanguageDialectSelector dialects={portuguese} selectedValue={"BR"} onChange={() => {}} />);

    const [european, brazilian] = screen.getAllByRole("radio");
    expect(brazilian).toHaveAttribute("aria-checked", "true");
    expect(european).toHaveAttribute("aria-checked", "false");
  });

  it("reports the country when a pill is picked", async () => {
    const onChange = vi.fn();
    render(<LanguageDialectSelector dialects={portuguese} selectedValue={""} onChange={onChange} />);

    await userEvent.click(screen.getAllByRole("radio")[1]);

    expect(onChange).toHaveBeenCalledWith("BR");
  });

  it("still reports a choice that merely confirms the default", async () => {
    // Storing 'PT' is not a no-op to the client even though the server narrows
    // it back to "no preference": the learner said it, so it gets saved.
    const onChange = vi.fn();
    render(<LanguageDialectSelector dialects={portuguese} selectedValue={""} onChange={onChange} />);

    await userEvent.click(screen.getAllByRole("radio")[0]);

    expect(onChange).toHaveBeenCalledWith("PT");
  });
});
