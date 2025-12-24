import strings from "../../i18n/definitions";

export default function PrivacyNotice() {
  return (
    <>
      <h2>{strings.privacyNotice}</h2>

      <p>{strings.zeeguuIsAResearchProject}</p>

      <p>
        {strings.the} <b>{strings.onlyPersonalInfo}</b> {strings.thatWeStore}
        <b>{strings.nameAndEmail}</b> {strings.restOfPersonalInfoMsg}
      </p>

      <p>
        {strings.weStore} <b>{strings.anonymizedData}</b> {strings.aboutYour}
        <b>{strings.interaction}</b>
        {strings.togetherWithThe}
        <b>{strings.times}</b>
        {strings.restOfDataStorageInfoMsg}
      </p>

      <p>{strings.weMightMakeDataAvailableInfo}</p>
    </>
  );
}
