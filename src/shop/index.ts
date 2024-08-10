import { LevelResult } from "../game";
import { HeroState } from "../unit";

export class ShopManager {
  async visitShop(state: HeroState): Promise<LevelResult> {
    return { state };
  }
}
