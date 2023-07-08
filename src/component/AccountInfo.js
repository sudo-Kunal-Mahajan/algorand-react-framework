import React from 'react';

const AssetDisplay = ({ publicAddress,assets,handleAssetsUpdate }) => {

  return (
    <div>
      <h2>Assets for Address: {publicAddress}</h2>
      {(assets && assets.length > 0) ? (
        <ul>
          {assets.map((asset) => (
            <li key={asset.assetId}>
              Asset ID: {asset.assetId}, Amount: {asset.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No assets found for this address.</p>
      )}
    </div>
  );
}

export default AssetDisplay;