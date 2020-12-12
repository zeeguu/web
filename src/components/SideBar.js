import './side-bar.css'

export default function SideBar () {
  return (
    <nav class='nav-menu'>
      <a
        href='javascript:void(0);'
        class='arrow-icon'
        id='arrow-p'
        onclick='sideBarFunction(this);'
      >
        <p class='arrow-nav-icon'>▲</p>
      </a>
      <div class='sidenav' id='myTopnav'>
        <a href='/read' rel='external'>
          <img
            class='zeeguuLogo'
            src='/static/images/zeeguuWhiteLogo.svg'
            alt='Zeeguu Logo - The Elephant'
          />
        </a>
        <div class='dropdown'>
          <button class='dropbtn' onclick="location.href='/read'">
            | Articles <span id='arrow'></span>
          </button>
          <div class='dropdown-content'>
            <a href='/read' rel='external'>
              {' '}
              All
            </a>
            <a href='/read/bookmarks' rel='external'>
              Bookmarks
            </a>
            <a href='/read/classroom' rel='external'>
              Classroom
            </a>
          </div>
        </div>
        <div class='dropdown'>
          <button class='dropbtn' onclick="location.href='/bookmarks'">
            | Words <span id='arrow'></span>
          </button>
          <div class='dropdown-content'>
            <a href='/bookmarks' rel='external'>
              Translated
            </a>
            <a href='/starred_bookmarks' rel='external'>
              Starred
            </a>
            <a href='/learned_bookmarks' rel='external'>
              Learned
            </a>
            <a href='/top_bookmarks' rel='external'>
              Top
            </a>
          </div>
        </div>
        <div class='dropdown'>
          <button
            class='dropbtn'
            onclick="location.href='/practice/#!/practice/plan/0'"
          >
            | Exercises <span id='arrow'></span>
          </button>
          <div class='dropdown-content'>
            <a href='/practice/#!/practice/plan/0' rel='external'>
              Easy
            </a>
            <a href='/practice/#!/practice/plan/1' rel='external'>
              Regular
            </a>
            <a href='/practice/#!/practice/plan/2' rel='external'>
              Ambitious
            </a>
          </div>
        </div>
        <div class='generalNavLinks'>
          <div class='hiddenSettingsBox' id='hidden'>
            <div class='hiddenOption'>
              <a class='hiddenText' href='/my_settings' rel='external'>
                Settings
              </a>
            </div>
            <div class='hiddenOption'>
              <a class='hiddenText' href='/stats' rel='external'>
                Statistics
              </a>
            </div>
            <div class='hiddenOption'>
              <a class='hiddenText' href='/teacher-dashboard' rel='external'>
                Teacher
              </a>
            </div>
            <div class='hiddenOption'>
              <a class='hiddenText' href='/about'>
                About
              </a>
            </div>
          </div>
          <div class='settingsbtn'>
            <a class='settingsLink' onclick='settingsFunction();'>
              <img
                class='settingsImg'
                src='/read/static/images/settingsWheel.svg'
                alt='Click here for general settings'
              />
            </a>
          </div>
          <div class='nav-generalbtn'>
            <a
              class='generalLinks'
              href='mailto:zeeguu.team@gmail.com'
              rel='external'
            >
              Get in touch
            </a>
          </div>
          <div class='nav-generalbtn'>
            <a class='generalLinks' href='/logout' rel='external'>
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
