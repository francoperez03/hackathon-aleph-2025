import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ServiceProvider = buildModule("ServiceProvider", (m) => {
  const worldId = m.getParameter("WorldId");
  const appId = m.getParameter("AppId");
  const actionId = m.getParameter("ActionId");
  const token = m.getParameter("PaymentToken");
  const price = m.getParameter("Price");
  const expirationTime = m.getParameter("ExpirationTime");
  const minReputation = m.getParameter("MinReputation")

  const serviceProvider = m.contract("ServiceProvider", [worldId, appId, actionId, token, price, expirationTime, minReputation]);

  return { serviceProvider };
});

export default ServiceProvider;
