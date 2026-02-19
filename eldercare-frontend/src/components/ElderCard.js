function ElderCard({ elder, children }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '8px', background: '#f9f9f9' }}>
      <p><strong>Name:</strong> {elder.full_name}</p>
      <p><strong>Age:</strong> {elder.age}</p>
      <p><strong>Gender:</strong> {elder.gender}</p>
      {children}
    </div>
  );
}

export default ElderCard;
