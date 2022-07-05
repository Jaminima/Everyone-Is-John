namespace EveryoneIsJohn_API.Data.Objects
{
    public class Item
    {
        #region Constructors

        public Item(string name, string description = "", int qty = 0)
        {
            Name = name;
            Description = description;
            Qty = qty;
        }

        #endregion Constructors

        #region Properties

        public string Description { get; set; }
        public string Name { get; set; }
        public int Qty { get; set; }

        #endregion Properties
    }
}