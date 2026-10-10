import { Sidebar } from "@cloudflare/kumo";
import {
  RssIcon,
  ArrowsClockwiseIcon,
  GithubLogoIcon,
  MoonIcon,
  SunIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import type { Feed } from "@cloud-reader/types";

interface FeedSidebarProps {
  feeds: Feed[];
  selectedFeedId: string | null;
  unreadCounts: Record<string, number>;
  isDark: boolean;
  isRefreshingAll: boolean;
  onSelectFeed: (id: string | null) => void;
  onRefreshAll: () => void;
  onAddFeed: () => void;
  onToggleDark: () => void;
}

export function FeedSidebar({
  feeds,
  selectedFeedId,
  unreadCounts,
  isDark,
  isRefreshingAll,
  onSelectFeed,
  onRefreshAll,
  onAddFeed,
  onToggleDark,
}: FeedSidebarProps) {
  return (
    <Sidebar>
      <Sidebar.Header className="py-2">
        <RssIcon
          weight="bold"
          className="text-kumo-brand group-data-[state=collapsed]/sidebar:hidden"
          size={20}
        />
        <span className="font-semibold text-kumo-strong group-data-[state=collapsed]/sidebar:hidden">
          cloud-reader
        </span>
        <Sidebar.Trigger className="ml-auto" />
      </Sidebar.Header>

      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  icon={<RssIcon />}
                  active={selectedFeedId === null}
                  onClick={() => onSelectFeed(null)}
                >
                  All articles
                </Sidebar.MenuButton>
                <Sidebar.MenuAction
                  title="Refresh all feeds"
                  onClick={onRefreshAll}
                  disabled={isRefreshingAll}
                >
                  <ArrowsClockwiseIcon className={isRefreshingAll ? "animate-spin" : ""} />
                </Sidebar.MenuAction>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>

        <Sidebar.Separator />

        <Sidebar.Group>
          <Sidebar.GroupLabel>Feeds</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <ul className="flex flex-col gap-0.5 px-2">
              {feeds.map((feed) => {
                const unread = unreadCounts[feed.id] ?? 0;
                const isActive = selectedFeedId === feed.id;
                return (
                  <li key={feed.id}>
                    <button
                      type="button"
                      onClick={() => onSelectFeed(feed.id)}
                      className={[
                        "flex w-full items-start gap-2.5 rounded-md px-2 py-2.5 text-left text-sm transition-colors",
                        isActive
                          ? "bg-kumo-tint font-medium text-kumo-strong"
                          : "text-kumo-default hover:bg-kumo-tint",
                      ].join(" ")}
                    >
                      {unread > 0 ? (
                        <span className="mt-0.5 min-w-[1.25rem] shrink-0 text-center text-xs font-semibold leading-none text-kumo-brand">
                          {unread}
                        </span>
                      ) : (
                        <span className="min-w-[1.25rem] shrink-0" />
                      )}
                      <span className="leading-snug">{feed.title ?? feed.url}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar.Content>

      <Sidebar.Footer>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton icon={<PlusIcon />} onClick={onAddFeed}>
              Add feed
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton icon={isDark ? <SunIcon /> : <MoonIcon />} onClick={onToggleDark}>
              {isDark ? "Light mode" : "Dark mode"}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              icon={<GithubLogoIcon />}
              onClick={() =>
                window.open(
                  "https://github.com/acviana/cloud-reader",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              Source code
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Footer>
    </Sidebar>
  );
}
