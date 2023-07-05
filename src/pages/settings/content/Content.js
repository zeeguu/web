import React, { useState, useEffect, useMemo, useCallback } from "react";
import strings from "../../../i18n/definitions";
import * as sc from "../../../components/Theme.sc";
import * as s from "./Content.sc";
import {
  InterestButton,
  variants,
} from "../../../components/interestButton/InterestButton";
import Modal from "./OwnInterestModal/OwnInterestModal";

export const interestsData = [
  {
    id: 18,
    title: "Business",
  },
  {
    id: 15,
    title: "Culture",
  },
  {
    id: 17,
    title: "Food",
  },
  {
    id: 11,
    title: "Health",
  },
  {
    id: 23,
    title: "Internet",
  },
  {
    id: 13,
    title: "Politics",
  },
  {
    id: 19,
    title: "Satire",
  },
  {
    id: 14,
    title: "Science",
  },
  {
    id: 21,
    title: "Social Sciences",
  },
  {
    id: 10,
    title: "Sport",
  },
  {
    id: 12,
    title: "Technology",
  },
  {
    id: 16,
    title: "Travel",
  },
];
export const nonInterestsData = [
  {
    name: "Art",
    value: false,
    id: "nonArt",
  },
  {
    name: "Business",
    value: false,
    id: "nonBusiness",
  },
  {
    name: "Culture",
    value: false,
    id: "nonCulture",
  },
  {
    name: "Food",
    value: false,
    id: "nonFood",
  },
  {
    name: "Health",
    value: false,
    id: "nonHealth",
  },
  {
    name: "Music",
    value: false,
    id: "nonMusic",
  },
  {
    name: "Politics",
    value: false,
    id: "nonPolitics",
  },
  {
    name: "Satire",
    value: false,
    id: "nonSatire",
  },
  {
    name: "Social",
    value: false,
    id: "nonSocial",
  },
  {
    name: "Science",
    value: false,
    id: "nonScience",
  },
  {
    name: "Social Sciences",
    value: false,
    id: "nonSocialSciences",
  },
  {
    name: "Sport",
    value: false,
    id: "nonSport",
  },
  {
    name: "Travel",
    value: false,
    id: "nonTravel",
  },
  {
    name: "Technology",
    value: false,
    id: "nonTechnology",
  },
];

export const Content = ({ api }) => {
  const [allInterestsActive, setAllInterestsActive] = useState(false);
  const [allNonInterestsActive, setAllNonInterestsActive] = useState(false);

  const [dividedNonInterests, setDividedNonInterests] = useState([]);
  const [nonSearchers, setNonSearchers] = useState([]);

  const [modalOpened, setModalOpened] = useState(false);
  const [searchers, setSearchers] = useState([]);
  const [dividedInterests, setDividedInterests] = useState({
    available: [], // Unsubscribed topics
    subscribed: [], // Subscribed topics
  });

  const interests = useMemo(() => {
    const { available, subscribed } = dividedInterests;

    if (!available.length && !subscribed.length) {
      return [];
    }

    // Create all interests array (sorted by interest's title)
    const sortedInterests = [...available, ...subscribed].sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    return sortedInterests;
  }, [dividedInterests]);

  const nonInterests = useMemo(() => {
    if (!dividedNonInterests.length) {
      return [];
    }

    // Create all interests array (sorted by non-interest's title)
    const sortedNonInterests = dividedNonInterests.sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    return sortedNonInterests;
  }, [dividedNonInterests]);

  const filteredSearchers = useMemo(() => {
    // Remove items from equal IDs from result searchers array
    const filtered = searchers.filter(
      (value, idx, self) =>
        idx ===
        self.findIndex(
          (item) => item.id === value.id || item.search === value.search
        )
    );

    return filtered;
  }, [searchers]);

  const filteredNonSearchers = useMemo(() => {
    // Remove items from equal IDs from result non-searchers array
    const filtered = nonSearchers.filter(
      (value, idx, self) =>
        idx ===
        self.findIndex(
          (item) => item.id === value.id || item.search === value.search
        )
    );

    return filtered;
  }, [nonSearchers]);

  const handleInterestPress = (currentInterest, isSubscribed, isInterests) => {
    const interests = isInterests ? dividedInterests : dividedNonInterests;

    if (isSubscribed) {
      // unsubscribe
      const filteredSubscribedInterests = interests.subscribed.filter(
        (interest) => interest.id !== currentInterest.id
      );

      if (isInterests) {
        setDividedInterests((prev) => ({
          ...prev,
          available: [...prev.available, currentInterest],
          subscribed: [...filteredSubscribedInterests],
        }));

        api.unsubscribeFromTopic(currentInterest);
      } else {
        setDividedNonInterests(filteredSubscribedInterests);

        api.unsubscribeFromFilter(currentInterest);
      }
    } else {
      // subscribe
      const filteredAvailableInterests = interests.available.filter(
        (interest) => interest.id !== currentInterest.id
      );

      if (isInterests) {
        setDividedInterests((prev) => ({
          ...prev,
          available: [...filteredAvailableInterests],
          subscribed: [...prev.subscribed, currentInterest],
        }));

        api.subscribeToTopic(currentInterest);
      } else {
        setDividedNonInterests(filteredAvailableInterests);

        api.subscribeToFilter(currentInterest);
      }
    }
  };

  const handleSearchPress = useCallback(
    (search, isInterests) => {
      if (isInterests) {
        api.unsubscribeFromSearch(search);

        const newSearchers = searchers.filter(
          (currentSearch) => currentSearch.id !== search.id
        );

        setSearchers(newSearchers);
      } else {
        api.unsubscribeFromSearchFilter(search);

        const newNonSearchers = nonSearchers.filter(
          (currentSearch) => currentSearch.id !== search.id
        );

        setNonSearchers(newNonSearchers);
      }
    },
    [searchers, nonSearchers]
  );

  const handleAllClick = (isInterests) => {
    if (isInterests) {
      setAllInterestsActive((prev) => !prev);
    } else {
      setAllNonInterestsActive((prev) => !prev);
    }
  };

  // No such function for non-interests because there is no filtered topics got from server
  useEffect(() => {
    if (allInterestsActive) {
      dividedInterests.available.forEach((interest) =>
        api.subscribeToTopic(interest)
      );
      setDividedInterests((prev) => ({
        available: [],
        subscribed: [...prev.available, ...prev.subscribed],
      }));
    } else {
      dividedInterests.subscribed.forEach((interest) =>
        api.unsubscribeFromTopic(interest)
      );
      setDividedInterests((prev) => ({
        available: [...prev.available, ...prev.subscribed],
        subscribed: [],
      }));
    }
  }, [allInterestsActive]);

  useEffect(() => {
    // Interests
    api.getAvailableTopics((data) => {
      setDividedInterests((prev) => ({ ...prev, available: [...data] }));
    });
    api.getSubscribedTopics((data) => {
      setDividedInterests((prev) => ({ ...prev, subscribed: [...data] }));
    });
    api.getSubscribedSearchers((data) => {
      setSearchers((prev) => [...prev, ...data]);
    });

    // Non Interests
    api.getFilteredTopics((data) => {
      setDividedNonInterests(data);
    });
    api.getSubscribedFilterSearches((data) => {
      setNonSearchers(data);
    });
  }, []);

  return (
    <div>
      <sc.H3>{strings.interests}</sc.H3>
      <div>
        <s.InterestsBox>
          <InterestButton
            variant={
              allInterestsActive ? variants.orangeFilled : variants.grayOutlined
            }
            title={strings.all}
            onClick={() => handleAllClick(true)}
          />
          <s.AddInterestBtn onClick={() => setModalOpened("interests")}>
            <s.Plus>
              <span></span>
              <span></span>
            </s.Plus>
            Your own interest
          </s.AddInterestBtn>
        </s.InterestsBox>
        <s.InterestsContainer>
          {interests.map((currentInterest) => {
            const isSubscribed = dividedInterests.subscribed.find(
              (interest) => interest.id === currentInterest.id
            );

            return (
              <InterestButton
                key={currentInterest.id}
                variant={
                  isSubscribed ? variants.orangeFilled : variants.grayOutlined
                }
                title={currentInterest.title}
                onClick={() =>
                  handleInterestPress(currentInterest, isSubscribed, true)
                }
              />
            );
          })}
          {filteredSearchers.map((currentSearch) => (
            <InterestButton
              key={currentSearch.id}
              variant={variants.orangeFilled}
              title={currentSearch.search}
              onClick={() => handleSearchPress(currentSearch, true)}
            />
          ))}
        </s.InterestsContainer>
      </div>

      <sc.H3>{strings.nonInterests}</sc.H3>
      <div>
        <s.InterestsBox>
          <InterestButton
            variant={
              allNonInterestsActive
                ? variants.grayFilled
                : variants.grayOutlined
            }
            title={strings.all}
            onClick={() => handleAllClick(false)}
          />
          <s.AddInterestBtn onClick={() => setModalOpened("non-interests")}>
            <s.Plus>
              <span></span>
              <span></span>
            </s.Plus>
            Your own non-interest
          </s.AddInterestBtn>
        </s.InterestsBox>
        <s.InterestsContainer>
          {nonInterests.map((currentNonInterest) => {
            const isSubscribed = dividedNonInterests.subscribed.find(
              (interest) => interest.id === currentNonInterest.id
            );

            return (
              <InterestButton
                key={currentNonInterest.id}
                variant={
                  isSubscribed ? variants.orangeFilled : variants.grayOutlined
                }
                title={currentNonInterest.title}
                onClick={() =>
                  handleInterestPress(currentNonInterest, isSubscribed, false)
                }
              />
            );
          })}
          {filteredNonSearchers.map((currentSearch) => (
            <InterestButton
              key={currentSearch.id}
              variant={variants.grayOutlined}
              title={currentSearch.search}
              onClick={() => handleSearchPress(currentSearch, false)}
            />
          ))}
        </s.InterestsContainer>
      </div>
      {/* <scs.SettingButton onClick={handleInterestsSave}>
        {strings.save}
      </scs.SettingButton> */}
      {modalOpened ? <s.Blocker /> : null}
      {modalOpened ? (
        <Modal
          modalOpened={modalOpened}
          setModalOpened={setModalOpened}
          setSearchers={setSearchers}
          setNonSearchers={setNonSearchers}
          api={api}
        />
      ) : null}
    </div>
  );
};
