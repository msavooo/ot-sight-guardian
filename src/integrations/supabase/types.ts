export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          anomaly_score: number
          asset_id: string
          description: string
          dst_name: string
          explanation: string
          id: string
          mitre: string
          owner: string
          protocol: string
          recommendation: string
          severity: string
          src_name: string
          status: string
          timestamp: string
          title: string
          type: string
          updated_at: string
          zone: string
        }
        Insert: {
          anomaly_score?: number
          asset_id: string
          description: string
          dst_name: string
          explanation: string
          id: string
          mitre: string
          owner?: string
          protocol: string
          recommendation: string
          severity: string
          src_name: string
          status?: string
          timestamp: string
          title: string
          type: string
          updated_at?: string
          zone: string
        }
        Update: {
          anomaly_score?: number
          asset_id?: string
          description?: string
          dst_name?: string
          explanation?: string
          id?: string
          mitre?: string
          owner?: string
          protocol?: string
          recommendation?: string
          severity?: string
          src_name?: string
          status?: string
          timestamp?: string
          title?: string
          type?: string
          updated_at?: string
          zone?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          criticality: string
          firmware: string
          first_seen: string
          id: string
          ip: string
          is_new: boolean
          last_seen: string
          location: string
          mac: string
          managed: boolean
          model: string
          name: string
          os: string
          protocols: Json
          purdue: string
          risk_score: number
          serial: string
          site: string
          status: string
          type: string
          vendor: string
          vulnerabilities: number
          zone: string
        }
        Insert: {
          criticality: string
          firmware: string
          first_seen?: string
          id: string
          ip: string
          is_new?: boolean
          last_seen?: string
          location: string
          mac: string
          managed?: boolean
          model: string
          name: string
          os: string
          protocols?: Json
          purdue: string
          risk_score?: number
          serial: string
          site: string
          status?: string
          type: string
          vendor: string
          vulnerabilities?: number
          zone: string
        }
        Update: {
          criticality?: string
          firmware?: string
          first_seen?: string
          id?: string
          ip?: string
          is_new?: boolean
          last_seen?: string
          location?: string
          mac?: string
          managed?: boolean
          model?: string
          name?: string
          os?: string
          protocols?: Json
          purdue?: string
          risk_score?: number
          serial?: string
          site?: string
          status?: string
          type?: string
          vendor?: string
          vulnerabilities?: number
          zone?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor: string
          id: string
          ip: string
          result: string
          role: string
          target: string
          time: string
          user_id: string | null
        }
        Insert: {
          action: string
          actor: string
          id?: string
          ip?: string
          result?: string
          role: string
          target: string
          time?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          actor?: string
          id?: string
          ip?: string
          result?: string
          role?: string
          target?: string
          time?: string
          user_id?: string | null
        }
        Relationships: []
      }
      baselines: {
        Row: {
          anomaly_score: number
          confidence: number
          dst_name: string
          frequency: string
          id: string
          port: number
          protocol: string
          reasons: Json
          src_name: string
          state: string
          typical_time: string
          volume: string
        }
        Insert: {
          anomaly_score?: number
          confidence: number
          dst_name: string
          frequency: string
          id: string
          port: number
          protocol: string
          reasons?: Json
          src_name: string
          state: string
          typical_time: string
          volume: string
        }
        Update: {
          anomaly_score?: number
          confidence?: number
          dst_name?: string
          frequency?: string
          id?: string
          port?: number
          protocol?: string
          reasons?: Json
          src_name?: string
          state?: string
          typical_time?: string
          volume?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          anomaly_score: number
          bytes: number
          dst_id: string
          dst_ip: string
          dst_name: string
          dst_port: number
          dst_zone: string
          id: string
          packets: number
          protocol: string
          risk: string
          src_id: string
          src_ip: string
          src_name: string
          src_port: number
          src_zone: string
          status: string
          timestamp: string
        }
        Insert: {
          anomaly_score?: number
          bytes: number
          dst_id: string
          dst_ip: string
          dst_name: string
          dst_port: number
          dst_zone: string
          id: string
          packets: number
          protocol: string
          risk: string
          src_id: string
          src_ip: string
          src_name: string
          src_port: number
          src_zone: string
          status: string
          timestamp: string
        }
        Update: {
          anomaly_score?: number
          bytes?: number
          dst_id?: string
          dst_ip?: string
          dst_name?: string
          dst_port?: number
          dst_zone?: string
          id?: string
          packets?: number
          protocol?: string
          risk?: string
          src_id?: string
          src_ip?: string
          src_name?: string
          src_port?: number
          src_zone?: string
          status?: string
          timestamp?: string
        }
        Relationships: []
      }
      investigation_events: {
        Row: {
          case_id: string
          detail: string
          id: string
          position: number
          severity: string
          time: string
          title: string
        }
        Insert: {
          case_id?: string
          detail: string
          id?: string
          position?: number
          severity: string
          time: string
          title: string
        }
        Update: {
          case_id?: string
          detail?: string
          id?: string
          position?: number
          severity?: string
          time?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      protocol_stats: {
        Row: {
          alerts: number
          assets: number
          category: string
          name: string
          port: number
          sessions: number
          unexpected: number
          volume: string
          volume_mb: number
        }
        Insert: {
          alerts?: number
          assets?: number
          category: string
          name: string
          port: number
          sessions?: number
          unexpected?: number
          volume: string
          volume_mb?: number
        }
        Update: {
          alerts?: number
          assets?: number
          category?: string
          name?: string
          port?: number
          sessions?: number
          unexpected?: number
          volume?: string
          volume_mb?: number
        }
        Relationships: []
      }
      sensors: {
        Row: {
          bandwidth: string
          health: number
          id: string
          interfaces: Json
          ip: string
          last_heartbeat: string
          location: string
          name: string
          packet_drops: string
          pps: number
          status: string
          version: string
        }
        Insert: {
          bandwidth: string
          health?: number
          id: string
          interfaces?: Json
          ip: string
          last_heartbeat: string
          location: string
          name: string
          packet_drops: string
          pps?: number
          status: string
          version: string
        }
        Update: {
          bandwidth?: string
          health?: number
          id?: string
          interfaces?: Json
          ip?: string
          last_heartbeat?: string
          location?: string
          name?: string
          packet_drops?: string
          pps?: number
          status?: string
          version?: string
        }
        Relationships: []
      }
      threat_intel: {
        Row: {
          campaign: string
          confidence: number
          id: string
          indicator: string
          last_seen: string
          matches: number
          severity: string
          source: string
          type: string
        }
        Insert: {
          campaign: string
          confidence: number
          id?: string
          indicator: string
          last_seen: string
          matches?: number
          severity: string
          source: string
          type: string
        }
        Update: {
          campaign?: string
          confidence?: number
          id?: string
          indicator?: string
          last_seen?: string
          matches?: number
          severity?: string
          source?: string
          type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vulnerabilities: {
        Row: {
          asset_id: string
          asset_name: string
          criticality: string
          cve: string
          cvss: number
          description: string
          exploitability: string
          id: string
          mitigation_available: boolean
          ot_risk: string
          patch_available: boolean
          product: string
          reachable: boolean
          risk_score: number
          status: string
          vendor: string
        }
        Insert: {
          asset_id: string
          asset_name: string
          criticality: string
          cve: string
          cvss: number
          description: string
          exploitability: string
          id?: string
          mitigation_available?: boolean
          ot_risk: string
          patch_available?: boolean
          product: string
          reachable?: boolean
          risk_score: number
          status?: string
          vendor: string
        }
        Update: {
          asset_id?: string
          asset_name?: string
          criticality?: string
          cve?: string
          cvss?: number
          description?: string
          exploitability?: string
          id?: string
          mitigation_available?: boolean
          ot_risk?: string
          patch_available?: boolean
          product?: string
          reachable?: boolean
          risk_score?: number
          status?: string
          vendor?: string
        }
        Relationships: []
      }
      zones: {
        Row: {
          alerts: number
          assets: number
          conduits: Json
          name: string
          purdue: string
          risk: string
          traffic: string
          unauthorized: number
        }
        Insert: {
          alerts?: number
          assets?: number
          conduits?: Json
          name: string
          purdue: string
          risk: string
          traffic: string
          unauthorized?: number
        }
        Update: {
          alerts?: number
          assets?: number
          conduits?: Json
          name?: string
          purdue?: string
          risk?: string
          traffic?: string
          unauthorized?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "analyst" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "analyst", "viewer"],
    },
  },
} as const
