namespace EveryoneIsJohn_API.Data.Objects
{
    public class DataObject
    {
        #region Constructors

        public DataObject()
        {
            Identifier = -1;
        }

        public DataObject(int identifier)
        {
            Identifier = identifier;
        }

        #endregion Constructors

        #region Properties

        public int Identifier { get; set; }

        #endregion Properties
    }
}