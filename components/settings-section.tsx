"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { LogOut, Bell, Moon, Globe, Shield, User, Sparkles, Save } from "lucide-react"
import { useFarcasterUser } from "@/hooks/use-farcaster"

interface SettingsSectionProps {
  username: string
  onLogout: () => void
}

export function SettingsSection({ username, onLogout }: SettingsSectionProps) {
  const { user } = useFarcasterUser(username)

  return (
    <div className="space-y-4 md:space-y-8 w-full max-w-2xl overflow-hidden px-1">
      {/* Header with 3D avatar */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="relative group">
          {user?.pfp_url ? (
            <img
              src={user.pfp_url || "/placeholder.svg"}
              alt={user.display_name}
              className="w-14 h-14 md:w-20 md:h-20 rounded-full ring-2 md:ring-4 ring-white shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
          ) : (
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center ring-2 md:ring-4 ring-white shadow-xl">
              <span className="text-white text-xl md:text-3xl font-bold">{username.charAt(0).toUpperCase()}</span>
            </div>
          )}
          {/* Glow effect */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
          {/* Power badge */}
          {user?.power_badge && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center ring-2 md:ring-4 ring-white">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-sm md:text-base text-slate-500">Manage your account preferences</p>
        </div>
      </div>

      {/* Account settings with 3D card */}
      <Card className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 card-3d relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-sky-100/50 to-transparent rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-200/50 flex-shrink-0">
              <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-base md:text-lg font-bold text-slate-800">Account</h2>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="text-xs md:text-sm font-medium text-slate-600 mb-2 block">Farcaster Username</label>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <Input
                  defaultValue={username}
                  className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50/80 px-4 md:px-5 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 text-base md:text-lg font-medium w-full"
                />
                <Button className="h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 shadow-lg shadow-sky-200/50 transition-all duration-300 hover:-translate-y-0.5 flex-shrink-0 w-full sm:w-auto">
                  <Save className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Update
                </Button>
              </div>
            </div>

            {user?.verified_addresses?.eth_addresses?.[0] && (
              <div>
                <label className="text-xs md:text-sm font-medium text-slate-600 mb-2 block">Connected Wallet</label>
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-slate-50 to-sky-50/50 border border-slate-100">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white text-xs md:text-sm font-bold">E</span>
                  </div>
                  <span className="text-xs md:text-sm font-mono text-slate-600 truncate">
                    {user.verified_addresses.eth_addresses[0].slice(0, 8)}...
                    {user.verified_addresses.eth_addresses[0].slice(-6)}
                  </span>
                  <div className="ml-auto px-2 md:px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] md:text-xs font-semibold flex-shrink-0">
                    Verified
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Notification settings with 3D toggles */}
      <Card className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 card-3d relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50 flex-shrink-0">
              <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-base md:text-lg font-bold text-slate-800">Notifications</h2>
          </div>

          <div className="space-y-3 md:space-y-5">
            {[
              {
                label: "Activity reminders",
                description: "Get reminded to post daily",
                defaultChecked: true,
              },
              {
                label: "Weekly summary",
                description: "Receive weekly stats report",
                defaultChecked: true,
              },
              {
                label: "Goal alerts",
                description: "Notify when you reach goals",
                defaultChecked: false,
              },
            ].map((setting) => (
              <div
                key={setting.label}
                className="flex items-center justify-between py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl hover:bg-slate-50/80 transition-colors duration-300"
              >
                <div className="mr-2">
                  <p className="font-semibold text-sm md:text-base text-slate-700">{setting.label}</p>
                  <p className="text-xs md:text-sm text-slate-400">{setting.description}</p>
                </div>
                <Switch defaultChecked={setting.defaultChecked} className="flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Preferences with enhanced styling */}
      <Card className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 card-3d relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-100/50 to-transparent rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200/50 flex-shrink-0">
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-base md:text-lg font-bold text-slate-800">Preferences</h2>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl hover:bg-slate-50/80 transition-colors duration-300">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Moon className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-slate-700">Dark mode</p>
                  <p className="text-xs md:text-sm text-slate-400">Coming soon</p>
                </div>
              </div>
              <Switch disabled className="flex-shrink-0" />
            </div>

            <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl hover:bg-slate-50/80 transition-colors duration-300">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-slate-700">Privacy mode</p>
                  <p className="text-xs md:text-sm text-slate-400">Hide activity from public</p>
                </div>
              </div>
              <Switch className="flex-shrink-0" />
            </div>
          </div>
        </div>
      </Card>

      {/* Logout button with 3D press effect */}
      <Button
        onClick={onLogout}
        variant="outline"
        className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl border-2 border-rose-200 text-rose-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-red-50 hover:text-rose-700 hover:border-rose-300 bg-transparent transition-all duration-300 text-base md:text-lg font-semibold hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-lg"
      >
        <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2" />
        Log out
      </Button>
    </div>
  )
}
