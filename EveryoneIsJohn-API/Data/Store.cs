namespace EveryoneIsJohn_API.Data
{
    public class Store<T> where T : Objects.DataObject
    {
        #region Fields

        public Dictionary<int, T> dataSet;
        public int Id = 0;

        #endregion Fields

        #region Constructors

        public Store()
        {
            dataSet = new Dictionary<int, T>();
        }

        #endregion Constructors

        #region Methods

        public T Append(T obj)
        {
            obj.Identifier = Id;
            dataSet.Add(Id, obj);
            Id++;
            return obj;
        }

        public bool Get(int Id, out T obj)
        {
            return dataSet.TryGetValue(Id, out obj);
        }

        public bool Remove(int Id)
        {
            return dataSet.Remove(Id);
        }

        public bool Remove(T obj)
        {
            return dataSet.Remove(obj.Identifier);
        }

        #endregion Methods
    }
}