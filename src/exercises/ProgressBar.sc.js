import styled from 'styled-components'

const ProgressBar = styled.div`
  /* background-color: lightcoral; */

  .progress-module {
    margin: 20px auto 40px;
    max-width: 800px;
    border-radius: 15px;
  }

  .ex-progress {
    position: relative;
    width: 100%;
    height: 25px;
    background-color: rgba(196, 196, 196, 0.42);
    border-radius: 15px;
    overflow: hidden;
  }

  #ex-bar {
    position: absolute;
    width: 0%;
    height: 100%;
    background-image: linear-gradient(
      89.5deg,
      #ffbb54 0.29%,
      #ffe59e 101.69%,
      #fff85d 101.7%,
      #fff95d 101.71%,
      rgba(255, 208, 71, 0) 101.72%
    );
    transition: all 0.5s;
    border-radius: 15px;
  }
`

export { ProgressBar }
