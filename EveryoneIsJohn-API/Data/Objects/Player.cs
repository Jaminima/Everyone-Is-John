namespace EveryoneIsJohn_API.Data.Objects
{
    public class Player
    {
        #region Constructors

        public Player(int user)
        {
            User = user;
            missions = new Mission[4];
            missions[0] = new Mission(0, 1, "Level 1 Mission");
            missions[1] = new Mission(1, 2, "Level 2 Mission");
            missions[2] = new Mission(2, 2, "Another Level 2 Mission");
            missions[3] = new Mission(3, 3, "Level 3 Mission");
        }

        #endregion Constructors

        #region Properties

        public Mission[] missions { get; set; }
        public int User { get; set; }

        #endregion Properties

        #region Classes

        public class Mission
        {
            #region Constructors

            public Mission()
            {
                this.idx = -1;
                this.desc = "";
                this.level = 0;
                this.acheived = 0;
                this.suggestedAcheived = 0;
            }

            public Mission(int idx)
            {
                this.idx = idx;
                this.desc = "";
                this.level = 0;
                this.acheived = 0;
                this.suggestedAcheived = 0;
            }

            public Mission(int idx, int level, string desc)
            {
                this.idx = idx;
                this.desc = desc;
                this.level = level;
                this.acheived = 0;
                this.suggestedAcheived = 0;
            }

            #endregion Constructors

            #region Properties

            public int acheived { get; set; }
            public string desc { get; set; }
            public int idx { get; set; }
            public int level { get; set; }
            public int suggestedAcheived { get; set; }

            #endregion Properties
        }

        #endregion Classes
    }
}