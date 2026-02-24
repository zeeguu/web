import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getBadgesForUser = async function(userId) {
  
    return await this.apiPost(`badges/${userId}`, (badges) => {
      console.log("Badges for user:", badges);
    })
}
