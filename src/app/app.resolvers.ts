import { inject } from "@angular/core";
import { NavigationService } from "app/core/navigation/navigation.service";
import { forkJoin } from "rxjs";
import { UserService } from "./core/user/user.service";
import { AccountService } from "./shared/core/domain/services/account.service";
import { UserSessionService } from "./shared/core/domain/services/session.service";

export const initialDataResolver = () => {
  const userService = inject(UserService);
  const navigationService = inject(NavigationService);
  // const accountService = inject(AccountService);
  // const sessionService = inject(UserSessionService);
  // const notificationsService = inject(NotificationsService);
  // const quickChatService = inject(QuickChatService);
  // const shortcutsService = inject(ShortcutsService);

  // Fork join multiple API endpoint calls to wait all of them to finish
  return forkJoin([
    navigationService.get(),
    userService.get(),
    // sessionService.checkSession(),
    //TODO: replace with token or anything when we use real login authentications.
    // accountService.getAccountLoggedinUser("khizer@gmail.com"),
    // accountService.getAccountLoggedinUser("feroze.ahmad@e2esp.com"),
    // notificationsService.getAll(),
    // quickChatService.getChats(),
    // shortcutsService.getAll(),
  ]);
};
