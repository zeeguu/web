import FormSection from "../../pages/_pages_shared/FormSection.sc";

export default {
  title: "Pages/FormSection",
  component: FormSection,
};

export const Default = {
  render: () => (
    <FormSection>
      <label htmlFor="section-email">Email</label>
      <input id="section-email" type="email" placeholder="Email" />
      <small>We will only use this for account notifications.</small>
    </FormSection>
  ),
};
